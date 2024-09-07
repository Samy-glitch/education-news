import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserAccount,
  signInAccount,
  getUserById,
  getRecentPosts,
  signOutAccount,
  signInWithGoogle,
  uploadUserImageToFirebase,
  getRecentNews,
  getBook,
  fetchBooks,
  unlikeBook,
  likeBook,
  uploadImages,
  fetchDataTableNews,
  fetchDataTableBook,
  likeNews,
  getNewsById,
} from "../firebase/api";
import { IBookDataTable, INewsDataTable, INewUser } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

// User

export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInWithGoogleMutation = () => {
  return useMutation({
    mutationFn: signInWithGoogle,
  });
};

export const useSignInAccountMutation = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccountMutation = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useGetUserById = (uid: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER, uid],
    queryFn: () => getUserById(uid),
    enabled: !!uid,
  });
};

export const useUploadUserImage = () => {
  return useMutation({
    mutationFn: (data: { imageBlob: Blob; userId: string }) =>
      uploadUserImageToFirebase(data.imageBlob, data.userId),
    onSuccess: (downloadURL) => {
      console.log("Image uploaded successfully:", downloadURL);
    },
    onError: (error) => {
      console.error("Failed to upload image:", error);
    },
  });
};

export const useUploadImages = () => {
  return useMutation((params: { imageBlobs: Blob[]; folderPath: string }) =>
    uploadImages(params.imageBlobs, params.folderPath)
  );
};

// Posts

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

// export const useLikePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       postId,
//       likesArray,
//     }: {
//       postId: string;
//       likesArray: string[];
//     }) => likePost(postId, likesArray),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };

// News

export const useGetRecentNews = (filter: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_NEWS, filter],
    queryFn: () => getRecentNews(filter),
    enabled: filter !== undefined,
  });
};

export const useGetNewsById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_NEWS_BY_ID, id],
    queryFn: () => getNewsById(id),
    enabled: !!id,
  });
};

export const useFetchDataTableNews = () => {
  return useQuery<INewsDataTable[], Error>(
    [QUERY_KEYS.GET_NEWS_DATATABLE],
    fetchDataTableNews,
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    }
  );
};

export const useLikeNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      newsId,
      likesArray,
    }: {
      newsId: string;
      likesArray: string[];
    }) => likeNews(newsId, likesArray),
    onSuccess: (newsId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_NEWS_BY_ID, newsId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_NEWS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

// Books

export const useFetchDataTableBooks = () => {
  return useQuery<IBookDataTable[], Error>(
    [QUERY_KEYS.GET_NEWS_DATATABLE],
    fetchDataTableBook,
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    }
  );
};

export const useGetBooks = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_BOOKS],
    queryFn: fetchBooks,
  });
};

export const useGetBook = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_BOOK_BY_ID, id],
    queryFn: () => getBook(id),
    enabled: !!id,
  });
};

export const useLikeBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      bookId: string;
      userId: string;
      hasLiked: boolean;
    }) => {
      const { bookId, userId, hasLiked } = params;
      if (!hasLiked) {
        await unlikeBook(bookId, userId);
      } else {
        await likeBook(bookId, userId);
      }
    },
    onSuccess: (_data, params) => {
      const { bookId } = params;
      queryClient.invalidateQueries([QUERY_KEYS.GET_BOOKS, bookId]);
      queryClient.invalidateQueries([QUERY_KEYS.GET_CURRENT_USER]);
    },
    onError: (error) => {
      console.error("Failed to update likes:", error);
    },
  });
};
