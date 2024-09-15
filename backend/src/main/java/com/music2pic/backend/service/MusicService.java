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

      // 创建 BlobId 对象
      BlobId blobId = BlobId.of(googleStorageConfig.getBucketName(), filename);

      // 创建 BlobInfo 对象
      BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();

      // 使用 Google Cloud Storage 客户端上传文件
      storage.create(blobInfo, file.getBytes());
      saveMusicOutDto.setFileName(filename);
      System.out.println("File uploaded to bucket " + googleStorageConfig.getBucketName() + " as " + file.getOriginalFilename());
    } catch (Exception e) {
      System.out.println("Error occurred: " + e.getMessage());
    }
    return saveMusicOutDto;
  }

  public Convert2TextOutDto convert2Text(String fileId) {
    Convert2TextOutDto convert2TextOutDto = new Convert2TextOutDto();
    // Initialize the storage client
    Storage storage = StorageOptions.getDefaultInstance().getService();

    URL signedUrl = storage.signUrl(
        BlobInfo.newBuilder(googleStorageConfig.getBucketName(), fileId).build(),
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
        TextContent.from("Please transcribe the lyrics of this song. use Japanese.")
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

  public Resource generateImage(Convert2TextOutDto textResult) throws IOException {
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
          String bytesBase64Encoded = fieldsMap.get("bytesBase64Encoded").getStringValue();
          byte[] imageData = Base64.getDecoder().decode(bytesBase64Encoded);
          return new ByteArrayResource(imageData);
        }
      }
    } catch (Exception e){
      e.printStackTrace();
    }
    return null;
  }

  private static Value mapToValue(Map<String, Object> map) throws InvalidProtocolBufferException {
    Gson gson = new Gson();
    String json = gson.toJson(map);
    Value.Builder builder = Value.newBuilder();
    JsonFormat.parser().merge(json, builder);
    return builder.build();
  }
}
