import { Router } from 'itty-router';
import { uploadPageHtml } from '../templates/upload';
import { managePageHtml } from '../templates/manage';
import { 
  handleUpload, 
  handleGetMapchip, 
  handleDeleteMapchip, 
  handleSearch 
} from './handlers';

const router = Router();

// ページルート
router.get('/', () => new Response(uploadPageHtml, {
  headers: { 'Content-Type': 'text/html' },
}));

router.get('/manage', () => new Response(managePageHtml, {
  headers: { 'Content-Type': 'text/html' },
}));

// APIルート
router.post('/api/mapchips', handleUpload);
router.get('/api/mapchips/:id', handleGetMapchip);
router.delete('/api/mapchips/:id', handleDeleteMapchip);
router.get('/api/search', handleSearch);

export default router;