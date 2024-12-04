import { Router } from 'itty-router';
import { uploadPageHtml } from '../templates/upload';
import { uploadSoundPageHtml } from '../templates/upload_sound';
import { manageSoundsPageHtml } from '../templates/manage_sounds';
import { managePageHtml } from '../templates/manage';
import { 
  handleUpload, 
  handleGetMapchip, 
  handleDeleteMapchip, 
  handleSearch, 
  handleUpdateTags, 
  handleUpdateCategory,
  handleUploadSound,
  handleGetSound,
  handleDeleteSound,
  handleSearchSounds,
  handleUpdateSoundTags
} from './handlers';

const router = Router();

// ページルート
router.get('/', () => new Response(uploadPageHtml, {
  headers: { 'Content-Type': 'text/html' },
}));

router.get('/sounds', () => new Response(uploadSoundPageHtml, {
  headers: { 'Content-Type': 'text/html' },
}));

router.get('/manage', () => new Response(managePageHtml, {
  headers: { 'Content-Type': 'text/html' },
}));

router.get('/manage/sounds', () => new Response(manageSoundsPageHtml, {
  headers: { 'Content-Type': 'text/html' },
}));

// APIルート
router.post('/api/mapchips', handleUpload);
router.get('/api/mapchips/:id', handleGetMapchip);
router.delete('/api/mapchips/:id', handleDeleteMapchip);
router.patch('/api/mapchips/:id/tags', handleUpdateTags);
router.patch('/api/mapchips/:id/category', handleUpdateCategory);
router.get('/api/search', handleSearch);

// 音声ファイル用APIルート
router.post('/api/sounds', handleUploadSound);
router.get('/api/sounds/search', handleSearchSounds);
router.get('/api/sounds/:id', handleGetSound);
router.delete('/api/sounds/:id', handleDeleteSound);
router.patch('/api/sounds/:id/tags', handleUpdateSoundTags);

export default router;