package com.music2pic.backend.service;

import com.google.cloud.aiplatform.v1.EndpointName;
import com.google.cloud.aiplatform.v1.PredictResponse;
import com.google.cloud.aiplatform.v1.PredictionServiceClient;
import com.google.cloud.aiplatform.v1.PredictionServiceSettings;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.HttpMethod;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.gson.Gson;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.Value;
import com.google.protobuf.util.JsonFormat;
import com.music2pic.backend.common.configuration.NormalConfig;
import com.music2pic.backend.common.configuration.StorageConfig;
import com.music2pic.backend.dto.music.Convert2TextOutDto;
import com.music2pic.backend.dto.music.SaveMusicOutDto;
import com.music2pic.backend.dto.music.Text2ImageOutDto;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.AudioContent;
import dev.langchain4j.data.message.TextContent;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.model.vertexai.VertexAiGeminiChatModel;
import java.io.IOException;
import java.net.URL;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MusicService {

  private final StorageConfig googleStorageConfig;
  private final NormalConfig googleNormalConfig;

  public SaveMusicOutDto saveMusic(MultipartFile file) {

    SaveMusicOutDto saveMusicOutDto = new SaveMusicOutDto();

    try {
      // 初始化 Storage 客户端
      Storage storage = StorageOptions.getDefaultInstance().getService();

      // 获取文件的 MIME 类型
      String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
      String contentType = file.getContentType();
      System.out.println(contentType);

      // 创建 BlobId 对象
      BlobId blobId = BlobId.of(googleStorageConfig.getBucketName(), filename);

      // 创建 BlobInfo 对象
      BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();

      // 使用 Google Cloud Storage 客户端上传文件
      storage.create(blobInfo, file.getBytes());
      System.out.println("File uploaded to bucket " + googleStorageConfig.getBucketName() + " as " + filename);
      URL signedUrl = storage.signUrl(
          BlobInfo.newBuilder(googleStorageConfig.getBucketName(), filename).build(),
          20, TimeUnit.MINUTES, // URL expiration time
          Storage.SignUrlOption.httpMethod(HttpMethod.GET) // HTTP method to be used
      );
      saveMusicOutDto.setFileUrl(signedUrl.toString());
    } catch (Exception e) {
      System.out.println("Error occurred: " + e.getMessage());
    }
    return saveMusicOutDto;
  }

  public Convert2TextOutDto convert2Text(String fileUrl) {
    Convert2TextOutDto convert2TextOutDto = new Convert2TextOutDto();
    // Print the signed URL (for debugging purposes)
    System.out.println("Signed URL: " + fileUrl);

    ChatLanguageModel model = VertexAiGeminiChatModel.builder()
                                                     .project(googleNormalConfig.getProjectId())
                                                     .location(googleNormalConfig.getLocation())
                                                     .modelName("gemini-1.5-pro")
                                                     .build();

    UserMessage userMessage = UserMessage.from(
        AudioContent.from(fileUrl),
        TextContent.from("# Generate Song-based Picture Prompt\n"
            + "\n"
            + "## Lyrics\n"
            + "Begin by analyzing the main themes and keywords from the song's lyrics. Focus on core imagery, metaphors, and specific words or phrases that paint a vivid picture (e.g., 'ocean waves,' 'fading sunset,' 'dancing in the rain').\n"
            + "\n"
            + "## Background Music Sentiment\n"
            + "Capture the emotion evoked by the melody, rhythm, and instrumentation of the background music. Is it uplifting, melancholic, suspenseful, or serene? Include how the mood of the music complements or contrasts with the lyrics.\n"
            + "\n"
            + "## Merge and Visualize\n"
            + "Combine the lyrical imagery with the sentiment. For example, if the lyrics are about a 'journey through a forest,' and the music evokes a feeling of suspense and tension, imagine a dense, dark forest scene at twilight, where shadows loom and mist fills the air, adding a mysterious atmosphere.")
    );

    try {
      Response<AiMessage> response = model.generate(userMessage);
      System.out.println("Transcribed Text:");
      System.out.println(response.content().text());
      convert2TextOutDto.setText(response.content().text());
      return convert2TextOutDto;
    } catch (Exception e) {
      System.out.println("Error during transcription: " + e.getMessage());
    }
    return convert2TextOutDto;
  }

  public Text2ImageOutDto generateImage(Convert2TextOutDto textResult) throws IOException {
    Text2ImageOutDto text2ImageOutDto = new Text2ImageOutDto();
    final String endpoint = String.format("%s-aiplatform.googleapis.com:443", googleNormalConfig.getLocation());
    PredictionServiceSettings predictionServiceSettings =
        PredictionServiceSettings.newBuilder().setEndpoint(endpoint).build();

    // Initialize client that will be used to send requests. This client only needs to be created
    // once, and can be reused for multiple requests.
    try (
        PredictionServiceClient predictionServiceClient =
        PredictionServiceClient.create(predictionServiceSettings)) {

      final EndpointName endpointName =
          EndpointName.ofProjectLocationPublisherModelName(
              googleNormalConfig.getProjectId(), googleNormalConfig.getLocation(), "google", "imagen-3.0-generate-001");

      Map<String, Object> instancesMap = new HashMap<>();
      instancesMap.put("prompt", textResult.getText());
      Value instances = mapToValue(instancesMap);

      Map<String, Object> paramsMap = new HashMap<>();
      paramsMap.put("sampleCount", 1);
      // You can't use a seed value and watermark at the same time.
      // paramsMap.put("seed", 100);
      // paramsMap.put("addWatermark", true);
      paramsMap.put("aspectRatio", "1:1");
      paramsMap.put("safetyFilterLevel", "block_some");
      paramsMap.put("personGeneration", "allow_adult");
      Value parameters = mapToValue(paramsMap);

      PredictResponse predictResponse =
          predictionServiceClient.predict(
              endpointName, Collections.singletonList(instances), parameters);

      for (Value prediction : predictResponse.getPredictionsList()) {
        Map<String, Value> fieldsMap = prediction.getStructValue().getFieldsMap();
        if (fieldsMap.containsKey("bytesBase64Encoded")) {
          text2ImageOutDto.setBase64Image(fieldsMap.get("bytesBase64Encoded").getStringValue());
          System.out.println(text2ImageOutDto.getBase64Image());
          return text2ImageOutDto;
        }
      }
      predictionServiceClient.shutdown();
    } catch (Exception e) {
      e.printStackTrace();
    }
    return text2ImageOutDto;
  }

  private static Value mapToValue(Map<String, Object> map) throws InvalidProtocolBufferException {
    Gson gson = new Gson();
    String json = gson.toJson(map);
    Value.Builder builder = Value.newBuilder();
    JsonFormat.parser().merge(json, builder);
    return builder.build();
  }
}
