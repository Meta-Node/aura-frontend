import {
  b64ToUrlSafeB64,
  hash,
  urlSafeRandomKey,
} from 'BrightID/utils/encoding';
import {
  CHANNEL_INFO_VERSION_1,
  CHANNEL_INFO_VERSION_2,
  channel_states,
  channel_types,
  GROUP_CHANNEL_TTL,
  SINGLE_CHANNEL_TTL,
  STAR_CHANNEL_TTL,
} from 'BrightID/utils/constants';
import ChannelAPI from 'BrightID/api/channelService';
import { encryptData } from 'BrightID/utils/cryptoHelper';
import { retrieveImage } from 'BrightID/utils/filesystem';

export const generateChannelData = async (
  channelType: ChannelType,
  url: URL,
): Promise<Channel> => {
  const aesKey = await urlSafeRandomKey(16);
  const id = await urlSafeRandomKey(9);
  const timestamp = Date.now();
  let ttl;
  switch (channelType) {
    case 'GROUP':
      ttl = GROUP_CHANNEL_TTL;
      break;
    case 'STAR':
      ttl = STAR_CHANNEL_TTL;
      break;
    case 'SINGLE':
    default:
      ttl = SINGLE_CHANNEL_TTL;
      break;
  }
  const myProfileId = await urlSafeRandomKey(9);
  const initiatorProfileId = myProfileId;
  const type = channelType;
  const state = channel_states.OPEN;
  const channelApi = new ChannelAPI(url.href);

  return {
    aesKey,
    api: channelApi,
    id,
    initiatorProfileId,
    myProfileId,
    state,
    timestamp,
    ttl,
    type,
    url,
  };
};

export const createChannelInfo = (channel: Channel) => {
  /*
    Channel types "SINGLE" and "GROUP" are compatible with CHANNEL_INFO_VERSION 1.
    Channel type "STAR" requires CHANNEL_INFO_VERSION 2
   */
  let version;
  switch (channel.type) {
    case channel_types.SINGLE:
    case channel_types.GROUP:
      version = CHANNEL_INFO_VERSION_1;
      break;
    case channel_types.STAR:
      version = CHANNEL_INFO_VERSION_2;
      break;
    default:
      throw new Error(`Unhandled channel type ${channel.type}`);
  }
  const obj: ChannelInfo = {
    version,
    type: channel.type,
    timestamp: channel.timestamp,
    ttl: channel.ttl,
    initiatorProfileId: channel.initiatorProfileId,
  };
  return obj;
};

export const buildChannelQrUrl = ({ aesKey, id, url }: Channel) => {
  const qrUrl = new URL(url.href);
  qrUrl.searchParams.append('aes', aesKey);
  qrUrl.searchParams.append('id', id);
  return qrUrl;
};

export const uploadConnection = async ({
  conn,
  channelApi,
  aesKey,
  signingKey,
}: {
  conn: Connection;
  channelApi: ChannelAPI;
  aesKey: string;
  signingKey: string;
}) => {
  try {
    const { id, name, photo, timestamp, socialMedia } = conn;
    let photoString = '';

    if (!name) {
      return;
    }

    // retrieve photo
    if (photo?.filename) {
      photoString = await retrieveImage(photo.filename);
    }

    const dataObj: SyncConnection = {
      id,
      photo: photoString,
      name,
      timestamp,
      socialMedia,
    };

    const encrypted = encryptData(dataObj, aesKey);
    console.log(`Posting profile data of ${id} ...`);
    await channelApi.upload({
      channelId: hash(aesKey),
      data: encrypted,
      dataId: `connection_${id}:${b64ToUrlSafeB64(signingKey)}`,
    });
  } catch (err) {
    console.error(`uploadConnection: ${err.message}`);
  }
};

export const uploadGroup = async ({
  group,
  channelApi,
  aesKey,
  signingKey,
}: {
  group: {
    id: string;
    name?: string;
    photo?: Photo;
    aesKey?: string;
    members: Array<string>;
    admins: Array<string>;
  };
  channelApi: ChannelAPI;
  aesKey: string;
  signingKey: string;
}) => {
  try {
    const { id, name, photo, aesKey: groupKey, members, admins } = group;
    let photoString = '';
    if (!groupKey) {
      // not worth uploading group data is missing
      return;
    }
    // retrieve photo
    if (photo?.filename) {
      photoString = await retrieveImage(photo.filename);
    }

    const dataObj = {
      id,
      photo: photoString,
      name,
      aesKey: groupKey,
      members,
      admins,
    };

    const encrypted = encryptData(dataObj, aesKey);
    console.log(`Posting group data of ${id} ...`);
    await channelApi.upload({
      channelId: hash(aesKey),
      data: encrypted,
      dataId: `group_${id}:${b64ToUrlSafeB64(signingKey)}`,
    });
  } catch (err) {
    console.error(`uploadGroup: ${err.message}`);
  }
};

export const uploadBlindSig = async ({
  sig,
  channelApi,
  aesKey,
  signingKey,
  prefix,
}: {
  sig: SigInfo;
  channelApi: ChannelAPI;
  aesKey: string;
  signingKey: string;
  prefix: string;
}) => {
  try {
    const encrypted = encryptData(sig, aesKey);
    console.log(
      `Posting blind sig for app: ${sig.app} verification: ${sig.verification} ...`,
    );
    await channelApi.upload({
      channelId: hash(aesKey),
      data: encrypted,
      // use hash of sig.uid to avoid revealing it
      dataId: `${prefix}blindsig_${hash(sig.uid)}:${b64ToUrlSafeB64(
        signingKey,
      )}`,
    });
  } catch (err) {
    console.error(`uploadBlindSig: ${err.message}`);
  }
};

export const uploadContextInfo = async ({
  contextInfo,
  channelApi,
  aesKey,
  signingKey,
  prefix,
}: {
  contextInfo: ContextInfo;
  channelApi: ChannelAPI;
  aesKey: string;
  signingKey: string;
  prefix: string;
}) => {
  try {
    const encrypted = encryptData(contextInfo, aesKey);
    console.log(
      `Posting ContextInfo: ${contextInfo.context} - ${contextInfo.contextId}...`,
    );
    await channelApi.upload({
      channelId: hash(aesKey),
      data: encrypted,
      dataId: `${prefix}contextInfo_${hash(
        contextInfo.context,
      )}:${b64ToUrlSafeB64(signingKey)}`,
    });
  } catch (err) {
    console.error(`uploadContextInfo: ${err.message}`);
  }
};