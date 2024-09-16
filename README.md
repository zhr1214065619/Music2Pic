# Music2Pic
Project for [google hackson](https://googlecloudjapanaihackathon.devpost.com/)

## Project Description (English follows Japanese):
このプロジェクトは、音楽を聴くことができない人々が音楽を楽しむ別の方法を提供するために設計されたシステムです。ユーザーが音楽ファイルをアップロードすると、その音楽の内容を反映した詳細な説明とイメージが生成されます。GoogleのVertex AIプラットフォームを使用し、Gemini-1.5-proモデルで音楽のコンテキストを分析し、イメージ生成のためのプロンプトを作成します。これらのプロンプトはImagen-3.0モデルで処理され、視覚的な表現が生成されます。システム全体はGoogle CloudのCloud Runサービスを使用してデプロイされており、リアルタイム処理においてスケーラビリティと効率性を確保しています。

This project is a system designed to help individuals who are unable to hear music by offering an alternative way to experience it. Users can upload a music file, and the system will generate both a detailed description and an image that reflects the essence of the music. By using Google's Vertex AI platform, we leverage the Gemini-1.5-pro model to analyze the context of the music and create prompts for image generation. These prompts are then processed through the Imagen-3.0 model to create visual representations. The entire system is deployed using Google Cloud's Cloud Run service, ensuring scalability and efficiency in real-time processing.


