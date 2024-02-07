import io from "socket.io-client";
import { apiSlice } from "../api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) =>
        `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${
          import.meta.env.VITE_APP_MESSAGE_LIMIT
        }`,

      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // create socket
        const socket = io(import.meta.env.VITE_APP_API_URL, {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttemps: 10,
          transports: ["websocket"],
          agent: false,
          upgrade: false,
          rejectUnauthorized: false,
        });

        try {
          await cacheDataLoaded;
          socket.on("messages", (data) => {
            updateCachedData((draft) => {
              const existMessage = draft.find(
                (message) => message.id == data?.data?.id
              );

              if (!existMessage) {
                draft.push(data?.data);
              }
            });
          });
        } catch (err) {
          console.error(err);
        }

        await cacheEntryRemoved;
        socket.close();
      },
    }),

    addMessage: builder.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetMessagesQuery } = messagesApi;
