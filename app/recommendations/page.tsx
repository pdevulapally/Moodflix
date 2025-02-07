"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const omdbApiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;

interface Movie {
  id: string;
  title: string;
  description?: string;
  posterUrl: string;
  source: string;
  watchProviders: { name: string; logo: string; link: string }[];
}

export default function Recommendations() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const preferences = localStorage.getItem("preferences");

    if (!preferences) {
      setError("Missing preferences. Please set your preferences first.");
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Missing preferences. Please set your preferences first.",
        variant: "destructive",
      });
      return;
    }

    const { language, genre } = JSON.parse(preferences);
    fetchMovies(language, genre);
  }, []);

  const fetchMovies = async (language: string, genre: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const genreMappings: Record<string, number> = {
        Action: 28,
        Comedy: 35,
        Drama: 18,
        Fantasy: 14,
        Horror: 27,
        Romance: 10749,
        "Sci-Fi": 878,
        Thriller: 53,
        Mystery: 9648,
      };

      const languageCode: Record<string, string> = {
        Hindi: "hi",
        English: "en",
        Telugu: "te",
        Spanish: "es",
        French: "fr",
        German: "de",
        Italian: "it",
        Japanese: "ja",
        Korean: "ko",
        Chinese: "zh",
      };

      if (!tmdbApiKey) {
        throw new Error("TMDb API key is not configured");
      }

      const randomPage = Math.floor(Math.random() * 10) + 1;
      const tmdbUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&language=en-US&with_original_language=${languageCode[language]}&with_genres=${genreMappings[genre]}&sort_by=popularity.desc&page=${randomPage}`;

      const tmdbResponse = await fetch(tmdbUrl);
      if (!tmdbResponse.ok) {
        throw new Error(`TMDb API error: ${tmdbResponse.statusText}`);
      }

      const tmdbData = await tmdbResponse.json();

      if (tmdbData.results?.length > 0) {
        const filteredMovies = await Promise.all(
          tmdbData.results.slice(0, 6).map(async (movie: any) => {
            const watchProviders = await fetchWatchProviders(movie.id, movie.title);
            return {
              id: movie.id.toString(),
              title: movie.title,
              description: movie.overview,
              posterUrl: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.jpg",
              source: "TMDb",
              watchProviders,
            };
          })
        );
        setMovies(filteredMovies);
      } else {
        await fetchFallbackFromOMDb(genre);
      }
    } catch (error) {
      console.error("Error fetching from TMDb:", error);
      await fetchFallbackFromOMDb(genre);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWatchProviders = async (movieId: string, movieTitle: string) => {
    try {
      const watchProviderUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${tmdbApiKey}`;
      const response = await fetch(watchProviderUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch watch providers");
      }

      const data = await response.json();
      const providers = data.results?.GB?.flatrate || []; // Default to UK (GB)

      return providers.length > 0
        ? providers.map((provider: any) => ({
            name: provider.provider_name,
            logo: provider.logo_path
              ? `https://image.tmdb.org/t/p/w92${provider.logo_path}`
              : "/placeholder.jpg",
            link: constructMovieLink(provider.provider_name, movieTitle),
          }))
        : [
            {
              name: "Not Available for Streaming",
              logo: "/placeholder.jpg",
              link: "#",
            },
          ];
    } catch (error) {
      console.error("Error fetching watch providers:", error);
      return [
        {
          name: "Streaming Info Unavailable",
          logo: "/placeholder.jpg",
          link: "#",
        },
      ];
    }
  };

  const constructMovieLink = (providerName: string, movieTitle: string): string => {
    const providerBaseUrls: Record<string, string> = {
      Netflix: `https://www.netflix.com/search?q=${encodeURIComponent(movieTitle)}`,
      "Amazon Prime Video": `https://www.primevideo.com/search?phrase=${encodeURIComponent(movieTitle)}`,
      "Disney+": `https://www.disneyplus.com/search?q=${encodeURIComponent(movieTitle)}`,
      Hulu: `https://www.hulu.com/search?q=${encodeURIComponent(movieTitle)}`,
      AppleTV: `https://tv.apple.com/search/${encodeURIComponent(movieTitle)}`,
      "HBO Max": `https://www.hbomax.com/search?q=${encodeURIComponent(movieTitle)}`,
    };

    return providerBaseUrls[providerName] || `https://www.google.com/search?q=${encodeURIComponent(movieTitle)}`;
  };

  const fetchFallbackFromOMDb = async (genre: string) => {
    try {
      if (!omdbApiKey) {
        throw new Error("OMDb API key is not configured");
      }

      const omdbUrl = `https://www.omdbapi.com/?s=${genre}&apikey=${omdbApiKey}`;
      const omdbResponse = await fetch(omdbUrl);

      if (!omdbResponse.ok) {
        throw new Error(`OMDb API error: ${omdbResponse.statusText}`);
      }

      const omdbData = await omdbResponse.json();

      if (omdbData.Response === "True" && omdbData.Search?.length > 0) {
        const filteredMovies = omdbData.Search.slice(0, 6).map((movie: any) => ({
          id: movie.imdbID,
          title: movie.Title,
          description: "No description available",
          posterUrl: movie.Poster !== "N/A" ? movie.Poster : "/placeholder.jpg",
          source: "OMDb",
          watchProviders: [
            { name: "Streaming Info Unavailable", logo: "/placeholder.jpg", link: "#" },
          ],
        }));
        setMovies(filteredMovies);
      } else {
        throw new Error("No movies found from OMDb");
      }
    } catch (error) {
      console.error("Error fetching from OMDb:", error);
      setError("No movies found from either TMDb or OMDb");
      toast({
        title: "Error",
        description: "No movies found from either TMDb or OMDb.",
        variant: "destructive",
      });
      setMovies([]);
    }
  };

  const handleRefresh = () => {
    const preferences = localStorage.getItem("preferences");

    if (!preferences) {
      setError("Missing preferences. Please set your preferences first.");
      toast({
        title: "Error",
        description: "Missing preferences. Please set your preferences first.",
        variant: "destructive",
      });
      return;
    }

    const { language, genre } = JSON.parse(preferences);
    fetchMovies(language, genre);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">
        Movies for Your Preferences
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="flex flex-col h-full bg-card shadow-lg">
                  <CardHeader>
                    <Skeleton className="h-4 w-2/3 bg-muted" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Skeleton className="w-full h-96 bg-muted" />
                    <Skeleton className="h-4 w-full mb-2 bg-muted" />
                    <Skeleton className="h-4 w-5/6 bg-muted" />
                  </CardContent>
                </Card>
              ))
          : movies.map((movie) => (
              <Card key={movie.id} className="flex flex-col h-full bg-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{movie.title}</CardTitle>
                  <CardDescription className="text-secondary text-sm">
                    Source: <span className="text-accent">{movie.source}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <img
                    src={movie.posterUrl}
                    alt={`${movie.title} poster`}
                    className="w-full h-106 object-cover mb-4 rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.jpg";
                    }}
                  />
                  <p className="text-sm text-muted-foreground">{movie.description || "No description available"}</p>
                  <p className="mt-4 text-sm font-semibold">Available on:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {movie.watchProviders.map((provider, index) => (
                      <a
                        key={index}
                        href={provider.link}
                        target={provider.link !== "#" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-muted p-2 rounded-md hover:bg-gray-200 transition"
                      >
                        <img
                          src={provider.logo}
                          alt={provider.name}
                          className="w-8 h-8 rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.jpg";
                          }}
                        />
                        <span className="text-sm font-medium">{provider.name}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={handleRefresh} size="lg" disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh Recommendations"}
        </Button>
      </div>
    </div>
  );
}
