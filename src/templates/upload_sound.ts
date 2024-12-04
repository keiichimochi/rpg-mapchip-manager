export const uploadSoundPageHtml = `<!DOCTYPE html>
<html>
<head>
  <title>RPG Sound Manager</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <meta charset="UTF-8">
</head>
<body class="bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">RPG サウンドマネージャー</h1>
      <div class="space-x-4">
        <a href="/" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          画像アップロードへ
        </a>
        <a href="/manage/sounds" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          音声管理へ
        </a>
        <a href="/manage" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          画像管理へ
        </a>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">音声ファイルのアップロード</h2>
      <form id="uploadForm" class="space-y-4">
        <div>
          <label class="block mb-2">音声ファイル:</label>
          <input type="file" name="file" accept="audio/*" required class="w-full p-2 border rounded">
        </div>
        <div>
          <label class="block mb-2">カテゴリー:</label>
          <select name="category" required class="w-full p-2 border rounded">
            <option value="bgm">BGM</option>
            <option value="se">効果音</option>
            <option value="voice">ボイス</option>
            <option value="ambient">環境音</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">タグ (カンマ区切り):</label>
          <input type="text" name="tags" class="w-full p-2 border rounded" placeholder="戦闘,緊迫,激しい">
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          アップロード
        </button>
      </form>
    </div>

    <div id="preview" class="bg-white p-6 rounded-lg shadow-md mb-8 hidden">
      <h2 class="text-xl font-semibold mb-4">プレビュー</h2>
      <audio id="previewAudio" controls class="w-full"></audio>
    </div>
  </div>
  
  <script>
    document.getElementById('uploadForm').onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      try {
        const res = await fetch('/api/sounds', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || 'アップロードに失敗しました');
        }
        
        alert('アップロード成功！');
        e.target.reset();
        document.getElementById('preview').classList.add('hidden');
      } catch (e) {
        console.error('Upload error:', e);
        alert('エラー: ' + e.message);
      }
    };

    document.querySelector('input[type="file"]').onchange = function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('preview').classList.remove('hidden');
          document.getElementById('previewAudio').src = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    };
  </script>
</body>
</html>`; 