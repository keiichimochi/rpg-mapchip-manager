export const manageSoundsPageHtml = `<!DOCTYPE html>
<html>
<head>
  <title>RPG Sound Manager</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; media-src 'self' *; connect-src 'self' *;">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">RPG サウンドマネージャー</h1>
      <div class="space-x-4">
        <a href="/sounds" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          アップロードへ
        </a>
        <a href="/manage" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          画像管理へ
        </a>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">検索フィルター</h2>
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block mb-2">カテゴリー:</label>
          <select id="categoryFilter" class="w-full p-2 border rounded">
            <option value="">すべて</option>
            <option value="bgm">BGM</option>
            <option value="se">効果音</option>
            <option value="voice">ボイス</option>
            <option value="ambient">環境音</option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block mb-2">タグ検索:</label>
          <input type="text" id="tagFilter" class="w-full p-2 border rounded" placeholder="タグを入力...">
        </div>
        <div class="flex items-end">
          <button onclick="searchSounds()" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            検索
          </button>
        </div>
      </div>
    </div>

    <div id="soundList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- サウンドリストがここに表示される -->
    </div>
  </div>

  <script>
    // 現在のドメインを取得
    const currentDomain = window.location.origin;

    // ページ読み込み時に検索を実行
    window.onload = () => searchSounds();

    async function searchSounds() {
      const category = document.getElementById('categoryFilter').value;
      const tag = document.getElementById('tagFilter').value;
      
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (tag) params.append('tag', tag);
        
        const res = await fetch(\`/api/sounds/search?\${params.toString()}\`);
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || '検索に失敗しました');
        }
        
        document.getElementById('soundList').innerHTML = data.data.map(sound => {
          const soundUrl = \`\${currentDomain}/api/sounds/\${sound.id}\`;
          
          return \`
            <div class="bg-gray-50 p-4 rounded-lg shadow">
              <div class="space-y-2">
                <p class="font-semibold">\${sound.filename}</p>
                <p class="text-sm text-gray-500">ID: \${sound.id}</p>
                <div class="flex items-center gap-2">
                  <a 
                    href="\${soundUrl}"
                    download="\${sound.filename}"
                    class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 shrink-0"
                  >
                    ダウンロード
                  </a>
                  <button 
                    onclick="copyToClipboard('\${sound.id}')"
                    class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 shrink-0"
                  >
                    IDコピー
                  </button>
                  <button 
                    onclick="copyToClipboard('\${soundUrl}')"
                    class="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 shrink-0"
                  >
                    URLコピー
                  </button>
                </div>
                <p>カテゴリー: \${sound.category}</p>
                <p>タグ: \${sound.tags || 'なし'}</p>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center gap-2">
                    <input 
                      type="text" 
                      value="\${sound.tags || ''}"
                      placeholder="新しいタグ（カンマ区切り）"
                      class="flex-1 p-2 border rounded text-sm"
                      onchange="updateTags('\${sound.id}', this.value)"
                    >
                  </div>
                  <button 
                    onclick="deleteSound('\${sound.id}')" 
                    class="w-full bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          \`;
        }).join('');
      } catch (e) {
        console.error('Search error:', e);
        alert('検索エラー: ' + e.message);
        document.getElementById('soundList').innerHTML = 
          '<p class="text-red-500 text-center col-span-full">エラーが発生しました</p>';
      }
    }

    async function deleteSound(id) {
      if (!confirm('本当に削除しますか？')) return;
      
      try {
        const res = await fetch(\`/api/sounds/\${id}\`, {
          method: 'DELETE'
        });
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || '削除に失敗しました');
        }
        
        alert('削除しました');
        searchSounds();
      } catch (e) {
        console.error('Delete error:', e);
        alert('削除エラー: ' + e.message);
      }
    }

    async function updateTags(id, newTags) {
      try {
        const res = await fetch(\`/api/sounds/\${id}/tags\`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tags: newTags })
        });
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || 'タグの更新に失敗しました');
        }
        
        alert('タグを更新しました');
        searchSounds();
      } catch (e) {
        console.error('Update tags error:', e);
        alert('タグ更新エラー: ' + e.message);
      }
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).catch(err => {
        console.error('Copy error:', err);
        alert('コピーに失敗しました');
      });
    }
  </script>
</body>
</html>`; 