import { getFeedsApi } from '@api';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const feedsData = await getFeedsApi();
  return feedsData;
});
