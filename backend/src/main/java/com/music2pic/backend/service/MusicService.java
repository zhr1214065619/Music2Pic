package com.music2pic.backend.service;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.HttpMethod;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.music2pic.backend.dto.music.Music2TextOutDto;
import com.music2pic.backend.dto.music.SaveMusicOutDto;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.AudioContent;
import dev.langchain4j.data.message.TextContent;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.model.vertexai.VertexAiGeminiChatModel;
import java.net.URL;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

@Service
public class MusicService {

  @Value("${google.bucketName}")
  private String bucketName;

  public SaveMusicOutDto saveMusic(MultipartFile file) {

    SaveMusicOutDto saveMusicOutDto = new SaveMusicOutDto();

    try {
      // 初始化 Storage 客户端
      Storage storage = StorageOptions.getDefaultInstance().getService();

      // 获取文件的 MIME 类型
      String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
      String contentType = file.getContentType();

      // 创建 BlobId 对象
      BlobId blobId = BlobId.of(bucketName, filename);

      // 创建 BlobInfo 对象
      BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();

      // 使用 Google Cloud Storage 客户端上传文件
      storage.create(blobInfo, file.getBytes());
      saveMusicOutDto.setFileName(filename);
      System.out.println("File uploaded to bucket " + bucketName + " as " + file.getOriginalFilename());
    } catch (Exception e) {
      System.out.println("Error occurred: " + e.getMessage());
    }
    return saveMusicOutDto;
  }

  public Music2TextOutDto convert2Text(String fileId) {
    Music2TextOutDto music2TextOutDto = new Music2TextOutDto();
    // Initialize the storage client
    Storage storage = StorageOptions.getDefaultInstance().getService();

    URL signedUrl = storage.signUrl(
        BlobInfo.newBuilder(bucketName, fileId).build(),
        10, TimeUnit.MINUTES, // URL expiration time
        Storage.SignUrlOption.httpMethod(HttpMethod.GET) // HTTP method to be used
    );

    // Print the signed URL (for debugging purposes)
    System.out.println("Signed URL: " + signedUrl);

    ChatLanguageModel model = VertexAiGeminiChatModel.builder()
                                                     .project(System.getenv("PROJECT_ID"))
                                                     .location(System.getenv("LOCATION"))
                                                     .modelName("gemini-1.5-pro")
                                                     .build();

    UserMessage userMessage = UserMessage.from(
        AudioContent.from(signedUrl.toString()),
        TextContent.from("Please transcribe the lyrics of this song. use Chinese.")
    );

    try {
      Response<AiMessage> response = model.generate(userMessage);
      System.out.println("Transcribed Text:");
      System.out.println(response.content().text());
      music2TextOutDto.setText(response.content().text());
      return music2TextOutDto;
    } catch (Exception e) {
      System.out.println("Error during transcription: " + e.getMessage());
    }
    return music2TextOutDto;
  }
}
