import express from 'express';
import {
  applicationRoute,
  authRoute,
  bookmarkRoute,
  categoryRoute,
  companyRoute,
  documentRoute,
  jobRoute,
  profileRoute,
  userRoute,
} from '../modules/index.js';

const router = express.Router();

router.use('/users', userRoute);
router.use('/authentications', authRoute);
router.use('/companies', companyRoute);
router.use('/categories', categoryRoute);
router.use('/jobs', jobRoute);
router.use('/documents', documentRoute);
router.use('/applications', applicationRoute);
router.use('/profile', profileRoute);
router.use('/', bookmarkRoute);

export default router;
