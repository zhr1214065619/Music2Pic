package com.music2pic.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseBody<T> {
  private boolean success;
  private String msg;
  private int status;
  private T data;

  public static ResponseBody<Object> fail(String msg, Integer status) {
    return new ResponseBody<>(false, msg, status, null);
  }

  public static <V> ResponseBody<V> ok(String msg, V data) {
    return new ResponseBody<>(true, msg, HttpStatus.OK.value(), data);
  }

  public static ResponseBody<Object> ok(String msg) {
    return ResponseBody.ok(msg, null);
  }

  public static <V> ResponseBody<V> ok(V data) {
    return ResponseBody.ok("", data);
  }

  public static ResponseBody<Object> ok() {
    return ResponseBody.ok("", null);
  }
}
