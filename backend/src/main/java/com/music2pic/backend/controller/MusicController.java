package com.music2pic.backend.controller;

import com.music2pic.backend.dto.ResponseBody;
import com.music2pic.backend.dto.music.Convert2TextOutDto;
import com.music2pic.backend.dto.music.Text2ImageOutDto;
import java.io.IOException;
import org.springframework.core.io.Resource;
import com.music2pic.backend.dto.music.SaveMusicOutDto;
import com.music2pic.backend.service.MusicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/music")
public class MusicController {

  private final MusicService musicService;

  @PostMapping("/saveMusic")
  public ResponseEntity<Object> saveMusic(@RequestParam("file") MultipartFile file) {
    SaveMusicOutDto saveMusicOutDto = musicService.saveMusic(file);
    return ResponseEntity.ok(ResponseBody.ok(saveMusicOutDto));
  }

  @PostMapping("/convert2Text")
  public ResponseEntity<Object> convert2Text(@RequestParam("fileUrl") String fileUrl) {
    Convert2TextOutDto convert2TextOutDto = musicService.convert2Text(fileUrl);
    return ResponseEntity.ok(ResponseBody.ok(convert2TextOutDto));
  }

  @PostMapping("/text2Image")
  public ResponseEntity<Object> downloadImage(@RequestBody Convert2TextOutDto requestDto) {
    Text2ImageOutDto text2ImageOutDto;
    try {
      text2ImageOutDto = musicService.generateImage(requestDto);
      return ResponseEntity.ok(ResponseBody.ok(text2ImageOutDto));
    } catch (IOException e) {
      return ResponseEntity.ok(ResponseBody.fail("作成エラー", 500));
    }
  }
}
