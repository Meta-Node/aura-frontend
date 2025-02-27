import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { hash } from 'utils/crypto';

import { createBlockiesImage } from '@/utils/image';

import { selectAuthData } from '../store/profile/selectors';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetProfilePhotoQuery } from '@/store/api/backup';

const DEFAULT_PROFILE_PICTURE = '/assets/images/avatar-thumb.jpg';
const BrightIdProfilePicture = ({
  subjectId,
  ...props
}: React.HTMLAttributes<HTMLImageElement> & {
  subjectId: string | undefined;
}) => {
  const imgSrc = useMemo(
    () =>
      subjectId ? createBlockiesImage(subjectId) : DEFAULT_PROFILE_PICTURE,
    [subjectId],
  );
  const authData = useSelector(selectAuthData);
  const { data } = useGetProfilePhotoQuery(
    authData && subjectId
      ? {
          brightId: subjectId,
          key: hash(authData.brightId + authData.password),
          password: authData.password,
        }
      : skipToken,
  );

  //TODO: use profile name in alt

  return (
    <img
      {...props}
      alt={subjectId}
      className={`${props.className ?? ''} object-cover`}
      src={data || imgSrc}
    />
  );
};

export default BrightIdProfilePicture;
