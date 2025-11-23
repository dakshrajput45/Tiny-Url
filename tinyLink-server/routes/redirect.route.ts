import { Router } from 'express';
import { RedirectLinkController } from '../controllers/redirectLink.controller';

const router = Router();

//redirect route
router.get('/:slug', RedirectLinkController.redirectLink);

export default router;