"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { joinSession } from "@/services/sessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Hash } from "lucide-react";
import GoBack from "@/components/goBack";
import { BrowserQRCodeReader } from "@zxing/browser";

const JoinSession = () => {
  // Estado para o código da sessão e o QRCode
  const [sessionCode, setSessionCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Referência para o elemento de vídeo, inicializado com `null` mas com tipo `HTMLVideoElement | null`
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleJoinSession = async () => {
    if (!user) {
      setError("Você deve estar autenticado para entrar em uma sessão.");
      return;
    }

    if (!sessionCode) {
      setError(
        "Por favor, insira um código de sessão ou escaneie um QR code para entrar."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { sessionId: returnedSessionId } = await joinSession(
        null,
        sessionCode
      );
      router.push(`/sessions/${returnedSessionId}`);
    } catch (err: any) {
      console.error("Erro ao entrar na sessão: ", err);
      setError(
        "Falha ao entrar na sessão. Por favor, verifique o código fornecido."
      );
    } finally {
      setLoading(false);
    }
  };

  const requestCameraPermissions = async () => {
    try {
      // Verifica se o navegador suporta a API de mídia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Navegador não suporta acesso à câmera.");
      }

      // Solicita a permissão de uso da câmera
      await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Permissão de câmera concedida.");
    } catch (err) {
      console.error("Erro ao solicitar permissão de câmera:", err);
      throw new Error(
        "Permissão de câmera negada. Por favor, habilite o uso da câmera."
      );
    }
  };

  const handleScanQRCode = async () => {
    setIsScanning(true);
    setError("");

    try {
      // Solicitar permissão para usar a câmera
      await requestCameraPermissions();

      if (videoRef.current) {
        // Acesse o método estático `listVideoInputDevices` diretamente da classe
        const videoInputDevices =
          await BrowserQRCodeReader.listVideoInputDevices();
        console.log(
          "Dispositivos de entrada de vídeo disponíveis: ",
          videoInputDevices
        );

        if (videoInputDevices.length === 0) {
          throw new Error("Nenhum dispositivo de câmera disponível.");
        }

        // Seleciona o primeiro dispositivo disponível para leitura do QR code
        const selectedDeviceId = videoInputDevices[0].deviceId;

        const codeReader = new BrowserQRCodeReader();
        const result = await codeReader.decodeOnceFromVideoDevice(
          selectedDeviceId,
          videoRef.current
        );

        setSessionCode(result.getText());
      } else {
        setError("Câmera não disponível.");
      }
    } catch (err) {
      console.error("Erro ao escanear o QR code: ", err);
      setError(
        "Falha ao escanear o QR code. Por favor, certifique-se de que a câmera está acessível e tente novamente."
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleStopScanning = () => {
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 pt-28 max-w-xl">
        <GoBack />

        <Card className="bg-white shadow-lg">
          <CardHeader className=" text-black">
            <CardTitle className="text-2xl font-bold text-center">
              Entrar em uma Sessão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Insira o código da sessão ou escaneie um QR code para entrar.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Hash className="w-5 h-5 text-[#560bad]" />
                <Input
                  type="text"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value)}
                  placeholder="Código da Sessão"
                  className="flex-1 border-gray-300 focus:ring-[#560bad] focus:border-[#560bad]"
                />
              </div>
              <div className="flex items-center justify-center">
                <Button
                  onClick={handleScanQRCode}
                  disabled={isScanning}
                  className="bg-[#560bad] hover:bg-[#3a0ca3] text-white"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  {isScanning ? "Escaneando..." : "Escanear QR Code"}
                </Button>
              </div>
            </div>
            {isScanning && (
              <div className="mt-4">
                {/* Elemento de vídeo para escanear QR code */}
                <video
                  ref={videoRef} // Atribuição da referência
                  className="w-full h-auto border rounded"
                />
                <Button
                  onClick={handleStopScanning}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white w-full"
                >
                  Parar Escaneamento
                </Button>
              </div>
            )}
            <Button
              onClick={handleJoinSession}
              disabled={loading}
              className="w-full bg-[#560bad] hover:bg-[#3a0ca3] text-white"
            >
              {loading ? "Entrando..." : "Entrar na Sessão"}
            </Button>
            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default JoinSession;
