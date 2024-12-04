import { Env } from './types/env';
import router from './router/routes';

export default {
  async fetch(request: Request, env: Env) {
    return router.handle(request, env);
  }
};