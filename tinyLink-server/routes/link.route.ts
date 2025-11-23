import { Router } from 'express';
import { GetLinkController } from '../controllers/getLink.controller';
import { AddLinkController } from '../controllers/addLink.controller';
import { DeleteLinkController } from '../controllers/deleteLink.controller';

const router = Router();

// get link routes
router.get('/healthz', GetLinkController.healthCheck);
router.get('/links/:slug', GetLinkController.getLink);
router.get('/links', GetLinkController.getAllLinksFromDb);

// add route
router.post('/links', AddLinkController.addLink);

// delete route
router.delete('/links/:slug', DeleteLinkController.deleteLink);    
export default router;
