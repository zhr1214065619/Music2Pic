package com.music2pic.backend.service;

import com.music2pic.backend.dto.Pic2Music.TestApiInDto;
import com.music2pic.backend.dto.Pic2Music.TestApiOutDto;
import org.springframework.stereotype.Service;

@Service
public class MusicService {
  public TestApiOutDto testServiceFunction(TestApiInDto indto) {
    String responseString = String.format("Hello World, %s", indto.getId());
    TestApiOutDto testApiOutDto = new TestApiOutDto();
    testApiOutDto.setMessage(responseString);
    return testApiOutDto;
  }
}
