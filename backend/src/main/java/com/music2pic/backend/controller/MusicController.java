package com.music2pic.backend.controller;

import com.music2pic.backend.dto.Pic2Music.TestApiInDto;
import com.music2pic.backend.dto.Pic2Music.TestApiOutDto;
import com.music2pic.backend.dto.ResponseBody;
import com.music2pic.backend.service.MusicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/music")
public class MusicController {

  private final MusicService musicService;

  @GetMapping("/test")
  public ResponseEntity<Object> testApi(TestApiInDto indto) {
    return ResponseEntity.ok(ResponseBody.ok(musicService.testServiceFunction(indto)));
  }
}
