export const uploadPageHtml = `<!DOCTYPE html>
<html>
<head>
  <title>RPG MapChip Manager</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <meta charset="UTF-8">
</head>
<body class="bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">RPG マップチップマネージャー</h1>
      <a href="/manage" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        管理ページへ
      </a>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">マップチップのアップロード</h2>
      <form id="uploadForm" class="space-y-4">
        <div>
          <label class="block mb-2">画像ファイル:</label>
          <input type="file" name="file" accept="image/*" required class="w-full p-2 border rounded">
        </div>
        <div>
          <label class="block mb-2">サイズ:</label>
          <select name="size" required class="w-full p-2 border rounded">
            <option value="16">16x16</option>
            <option value="32">32x32</option>
            <option value="64">64x64</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">カテゴリー:</label>
          <select name="category" required class="w-full p-2 border rounded">
            <option value="character">キャラクター</option>
            <option value="mapchip">マップチップ</option>
            <option value="monster">モンスター</option>
            <option value="item">アイテム</option>
            <option value="effect">エフェクト</option>
            <option value="ui">UI素材</option>
          </select>
        </div>
        <div>
          <label class="block mb-2">タグ (カンマ区切り):</label>
          <input type="text" name="tags" class="w-full p-2 border rounded" placeholder="草原,森,通行可能">
        </div>
        <div>
          <label class="block mb-2">フラグ:</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="checkbox" name="walkable" value="1">
              <span class="ml-2">侵入可能</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" name="event" value="1">
              <span class="ml-2">イベント</span>
            </label>
          </div>
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          アップロード
        </button>
      </form>
    </div>

    <div id="preview" class="bg-white p-6 rounded-lg shadow-md mb-8 hidden">
      <h2 class="text-xl font-semibold mb-4">プレビュー</h2>
      <img id="previewImage" class="max-w-xs mx-auto">
    </div>
  </div>
  
  <script>
    document.getElementById('uploadForm').onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const flags = {
        walkable: formData.get('walkable') === '1',
        event: formData.get('event') === '1'
      };
      formData.set('flags', JSON.stringify(flags));
      
      try {
        const res = await fetch('/api/mapchips', {
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
          document.getElementById('previewImage').src = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    };
  </script>
</body>
</html>`;