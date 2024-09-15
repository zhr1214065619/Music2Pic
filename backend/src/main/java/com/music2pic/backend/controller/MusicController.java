package com.music2pic.backend.controller;

import com.music2pic.backend.dto.ResponseBody;
import org.springframework.core.io.Resource;
import com.music2pic.backend.dto.music.Music2TextOutDto;
import com.music2pic.backend.dto.music.SaveMusicOutDto;
import com.music2pic.backend.service.MusicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
  public ResponseEntity<Object> convert2Text(@RequestParam("fileId") String fileId) {
    Music2TextOutDto music2TextOutDto = musicService.convert2Text(fileId);
    return ResponseEntity.ok(ResponseBody.ok(music2TextOutDto));
  }

  @GetMapping("/text2Image")
  public ResponseEntity<Resource> downloadImage(@RequestParam String filePath) {
    Resource resource = null;
    if (resource.exists() && resource.isReadable()) {
      return ResponseEntity.ok()
                           .contentType(
                               MediaType.IMAGE_JPEG)  // You might need to adjust the content type based on the file type
                           .header(
                               HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                           .body(resource);
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}
