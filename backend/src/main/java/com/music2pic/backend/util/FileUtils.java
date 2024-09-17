package com.music2pic.backend.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class FileUtils {
  public static String getMimeTypeFromURL(String stringUrl) throws IOException {
    URL url = new URL(stringUrl);
    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
    connection.setRequestMethod("HEAD");
    connection.connect();
    String mimeType = connection.getContentType();
    connection.disconnect();
    return mimeType;
  }

  public static byte[] getDataFromURL(String stringUrl) throws IOException {
    URL url = new URL(stringUrl);
    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
    InputStream inputStream = connection.getInputStream();
    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
    int nRead;
    byte[] data = new byte[16384];
    while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
      buffer.write(data, 0, nRead);
    }
    buffer.flush();
    inputStream.close();
    connection.disconnect();
    return buffer.toByteArray();
  }
}
