export const managePageHtml = `<!DOCTYPE html>
<html>
<head>
  <title>マップチップ管理ページ</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <meta charset="UTF-8">
  <style>
    .mapchip-image {
      width: 100%;
      height: 192px;
      background-color: white;
      border: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      image-rendering: pixelated;  /* ピクセルアートを鮮明に表示 */
    }
    
    .mapchip-image img {
      object-fit: contain;
      max-width: 100%;
      max-height: 100%;
    }
  </style>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">マップチップ管理ページ</h1>
      <a href="/" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        アップロードページへ
      </a>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">フィルター</h2>
      <div class="flex space-x-4">
        <input type="text" id="searchTag" placeholder="タグで検索" class="flex-1 p-2 border rounded">
        <select id="searchCategory" class="p-2 border rounded">
          <option value="">全てのカテゴリー</option>
          <option value="character">キャラクター</option>
          <option value="mapchip">マップチップ</option>
          <option value="monster">モンスター</option>
          <option value="item">アイテム</option>
          <option value="effect">エフェクト</option>
          <option value="ui">UI素材</option>
        </select>
        <select id="searchSize" class="p-2 border rounded">
          <option value="">全てのサイズ</option>
          <option value="16">16x16</option>
          <option value="32">32x32</option>
          <option value="64">64x64</option>
        </select>
        <button onclick="searchMapchips()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          検索
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">マップチップ一覧</h2>
      <div id="mapchipList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      </div>
    </div>
  </div>

  <script>
    window.onload = () => searchMapchips();

    async function copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        alert('URLをコピーしました！');
      } catch (err) {
        alert('コピーに失敗しました: ' + err);
      }
    }

    function displayImage(url, size) {
      // 実際のサイズの8倍で表示
      const displaySize = size * 8;
      return \`
        <div class="mapchip-image">
          <img 
            src="\${url}" 
            style="width: \${displaySize}px; height: \${displaySize}px;"
            onload="this.style.opacity='1'"
            onerror="this.parentElement.innerHTML='読み込みエラー'"
          >
        </div>
      \`;
    }

    async function searchMapchips() {
      const tag = document.getElementById('searchTag').value;
      const size = document.getElementById('searchSize').value;
      const category = document.getElementById('searchCategory').value;
      
      const params = new URLSearchParams();
      if (tag) params.append('tag', tag);
      if (size) params.append('size', size);
      if (category) params.append('category', category);
      
      try {
        const res = await fetch('/api/search?' + params);
        const response = await res.json();
        console.log('Search response:', response);
        
        if (!response.success) {
          throw new Error(response.error || '検索に失敗しました');
        }
        
        const mapchipList = document.getElementById('mapchipList');
        const data = response.data || [];
        
        if (data.length === 0) {
          mapchipList.innerHTML = '<p class="text-gray-500 text-center col-span-full">マップチップが見つかりませんでした</p>';
          return;
        }

        const currentUrl = window.location.origin;
        
        mapchipList.innerHTML = data.map(chip => {
          let flags = {};
          try {
            flags = JSON.parse(chip.flags);
          } catch (e) {
            console.error('Failed to parse flags:', chip.flags);
          }

          const imageUrl = \`\${currentUrl}/api/mapchips/\${chip.id}\`;
          
          return \`
            <div class="bg-gray-50 p-4 rounded-lg shadow">
              \${displayImage(imageUrl, chip.size)}
              <div class="space-y-2 mt-4">
                <p class="font-semibold">\${chip.filename}</p>
                <div class="flex items-center gap-2">
                  <select 
                    class="flex-1 p-2 border rounded text-sm"
                    onchange="updateCategory('\${chip.id}', this.value)"
                    value="\${chip.category}"
                  >
                    <option value="character" \${chip.category === 'character' ? 'selected' : ''}>キャラクター</option>
                    <option value="mapchip" \${chip.category === 'mapchip' ? 'selected' : ''}>マップチップ</option>
                    <option value="monster" \${chip.category === 'monster' ? 'selected' : ''}>モンスター</option>
                    <option value="item" \${chip.category === 'item' ? 'selected' : ''}>アイテム</option>
                    <option value="effect" \${chip.category === 'effect' ? 'selected' : ''}>エフェクト</option>
                    <option value="ui" \${chip.category === 'ui' ? 'selected' : ''}>UI素材</option>
                  </select>
                </div>
                <p>サイズ: \${chip.size}x\${chip.size}</p>
                <p>タグ: \${chip.tags || 'なし'}</p>
                <p>フラグ: \${Object.entries(flags)
                  .filter(([_, value]) => value)
                  .map(([key, _]) => key)
                  .join(', ') || 'なし'}</p>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center gap-2">
                    <input 
                      type="text" 
                      value="\${chip.tags || ''}"
                      placeholder="新しいタグ（カンマ区切り）"
                      class="flex-1 p-2 border rounded text-sm"
                      onchange="updateTags('\${chip.id}', this.value)"
                    >
                  </div>
                  <div class="flex items-center gap-2 p-2 bg-gray-100 rounded text-sm">
                    <span class="flex-1 truncate">\${imageUrl}</span>
                    <button 
                      onclick="copyToClipboard('\${imageUrl}')"
                      class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 shrink-0"
                    >
                      URLコピー
                    </button>
                  </div>
                  <button 
                    onclick="deleteMapchip('\${chip.id}')" 
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
        document.getElementById('mapchipList').innerHTML = 
          '<p class="text-red-500 text-center col-span-full">エラーが発生しました</p>';
      }
    }

    async function deleteMapchip(id) {
      if (!confirm('本当に削除しますか？')) return;
      
      try {
        const res = await fetch(\`/api/mapchips/\${id}\`, {
          method: 'DELETE'
        });
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || '削除に失敗しました');
        }
        
        alert('削除しました');
        searchMapchips();
      } catch (e) {
        console.error('Delete error:', e);
        alert('削除エラー: ' + e.message);
      }
    }

    async function updateTags(id, newTags) {
      try {
        const res = await fetch(\`/api/mapchips/\${id}/tags\`, {
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
        searchMapchips();
      } catch (e) {
        console.error('Update tags error:', e);
        alert('タグ更新エラー: ' + e.message);
      }
    }

    async function updateCategory(id, newCategory) {
      try {
        const res = await fetch(\`/api/mapchips/\${id}/category\`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ category: newCategory })
        });
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || 'カテゴリーの更新に失敗しました');
        }
        
        alert('カテゴリーを更新しました');
        searchMapchips();
      } catch (e) {
        console.error('Update category error:', e);
        alert('カテゴリー更新エラー: ' + e.message);
      }
    }
  </script>
</body>
</html>`;