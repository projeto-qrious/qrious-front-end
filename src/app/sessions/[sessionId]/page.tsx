"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { fetchSession } from "@/services/sessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Goback from "@/components/goBack";

const SessionPage = () => {
  const router = useRouter();
  const params = useParams();
  const sessionId = Array.isArray(params?.sessionId)
    ? params.sessionId[0]
    : params?.sessionId;
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      const loadSession = async () => {
        try {
          const data = await fetchSession(sessionId as string);
          setSession(data);
        } catch (error) {
          console.error("Error loading session:", error);
          router.push("/join-session");
        } finally {
          setLoading(false);
        }
      };

      loadSession();
    }
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#560bad]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 pt-28 max-w-3xl">
        <Goback />
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader className=" text-black">
            <CardTitle className="text-2xl font-bold">
              {session?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{session?.description}</p>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4 text-[#560bad]">Questions</h2>
        <div className="space-y-4">
          {session?.questions &&
            Object.values(session.questions).map((question: any) => (
              <Card
                key={question.id}
                className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <CardContent className="p-4">
                  <p className="text-lg mb-2 text-gray-800">{question.text}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By: {question.createdBy}</span>
                    <div className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1 text-[#560bad]" />
                      <span>{question.votes || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </main>
    </div>
  );
};

export default SessionPage;
