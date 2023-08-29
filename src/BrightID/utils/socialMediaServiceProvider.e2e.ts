import { SocialMediaService } from 'BrightID/api/socialMediaService';
import {
  SocialMediaQueryRequest,
  SocialMediaQueryResponse,
} from 'BrightID/api/socialMediaService_types';

const socialMediaService = new SocialMediaService();

// monkeypatch query function to always return all queried entries
socialMediaService.querySocialMedia = async (
  payload: SocialMediaQueryRequest,
) => {
  console.log(`Mocking socialMediaService`);
  return new Promise((resolve) => {
    const response: SocialMediaQueryResponse = payload.profileHashes;
    resolve(response);
  });
};

export default socialMediaService;