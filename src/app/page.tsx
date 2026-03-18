"use client";

import { useState } from "react";
import { Calendar, Clock, ChevronRight, Check, X, ArrowLeft } from "lucide-react";

// Datos de prueba (Mock Data simulando la BD)
const SERVICES = [
  {
    id: "s1",
    name: "Sesión Fotográfica Premium",
    duration: 60,
    price: "$150",
    includes: ["50 fotos editadas en alta resolución", "2 cambios de ropa permitidos", "Entrega digital en 48 hrs"],
    excludes: ["Maquillaje y peinado", "Fotografías impresas físicas"],
  },
  {
    id: "s2",
    name: "Sesión Express (LinkedIn/CV)",
    duration: 30,
    price: "$80",
    includes: ["15 fotos editadas empresariales", "1 fondo sólido a elegir"],
    excludes: ["Cambios de ropa", "Maquillaje profesional", "Retoque fotográfico avanzado"],
  }
];

const AVAILABLE_TIMES = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
  "01:00 PM", "01:30 PM", "02:00 PM", "04:30 PM"
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleSelectService = (service: typeof SERVICES[0]) => {
    setSelectedService(service);
    // Cambiamos al paso 2 (Selección de tiempo)
    setStep(2);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    // Al confirmar, pasamos a la pantalla de éxito
    setStep(3);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 relative overflow-hidden">
      {/* Decorative ambient background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10 mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -z-10 mix-blend-screen"></div>

      <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row gap-8 items-start justify-center">
        
        {/* Left Side: Business Info / Contextual Selection */}
        <div className="flex-1 space-y-6 pt-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
              Premium Studio
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Sistema inteligente de reservas. Completa tu cita en tres simples pasos sin fricciones.
            </p>
          </div>
          
          {selectedService && (
            <div className="glass-panel p-6 space-y-4 border-l-4 border-l-primary">
              <h3 className="text-zinc-100 font-medium tracking-wide text-sm uppercase">Tu selección actual:</h3>
              <div className="flex items-center gap-3 text-zinc-300">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-medium">{selectedService.name} ({selectedService.duration} min)</span>
              </div>
              {selectedTime && (
                <div className="flex items-center gap-3 text-zinc-300">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium">18 Mar 2026 - {selectedTime}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Interactive Booking Widget */}
        <div className="flex-[1.2] w-full glass-panel p-6 md:p-8 shadow-2xl relative min-h-[550px] flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none border border-white/10"></div>
          
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="relative z-10 flex flex-col h-full animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">
                Paso 1: ¿Qué servicio necesitas?
              </h2>
              <div className="space-y-5 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {SERVICES.map((srv) => (
                  <div 
                    key={srv.id} 
                    onClick={() => handleSelectService(srv)}
                    className="p-5 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/40 rounded-xl cursor-pointer transition-all duration-300 group shadow-lg hover:shadow-primary/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{srv.name}</h3>
                      <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-full text-sm">{srv.price}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400 mb-5">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-zinc-500" /> Duración: {srv.duration} min</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 text-sm border-t border-white/5 pt-4">
                      <div>
                        <p className="text-zinc-200 font-semibold mb-2 flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400"/> Incluye:</p>
                        <ul className="space-y-2">
                          {srv.includes.map((inc, i) => (
                            <li key={i} className="flex items-start gap-2 text-zinc-400 leading-tight">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-1.5 shrink-0"></span>
                              {inc}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-zinc-200 font-semibold mb-2 flex items-center gap-2"><X className="w-4 h-4 text-rose-400"/> No incluye:</p>
                        <ul className="space-y-2">
                          {srv.excludes.map((exc, i) => (
                            <li key={i} className="flex items-start gap-2 text-zinc-500 leading-tight">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500/50 mt-1.5 shrink-0"></span>
                              {exc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Date & Time */}
          {step === 2 && (
            <div className="relative z-10 flex flex-col h-full animate-fade-in text-white">
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => { setStep(1); setSelectedTime(null); }}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold tracking-tight">
                  Paso 2: Fecha y Hora
                </h2>
              </div>
              
              <div className="mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                <p className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Días disponibles (Marzo 2026)</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  <div className="min-w-[80px] bg-primary/20 border-2 border-primary text-center py-3 rounded-xl text-primary font-bold cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                    <p className="text-xs uppercase opacity-80 mb-1">Mié</p>
                    <p className="text-2xl">18</p>
                  </div>
                  <div className="min-w-[80px] bg-white/5 border border-white/10 text-center py-3 rounded-xl text-zinc-400 cursor-not-allowed opacity-50 grayscale">
                    <p className="text-xs uppercase opacity-80 mb-1">Jue</p>
                    <p className="text-2xl">19</p>
                  </div>
                  <div className="min-w-[80px] bg-white/5 border border-white/10 text-center py-3 rounded-xl text-zinc-300 hover:bg-white/10 cursor-pointer transition-colors">
                    <p className="text-xs uppercase opacity-80 mb-1">Vie</p>
                    <p className="text-2xl">20</p>
                  </div>
                </div>
              </div>

              <p className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Horarios de atención</p>
              <div className="grid grid-cols-2 gap-3 mb-8 overflow-y-auto flex-1 pr-2">
                {AVAILABLE_TIMES.map((time) => (
                  <button 
                    key={time}
                    onClick={() => handleSelectTime(time)}
                    className={`group relative px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-between overflow-hidden border ${
                      selectedTime === time 
                        ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(139,92,246,0.5)]" 
                        : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-zinc-300 hover:text-white"
                    }`}
                  >
                    <span className="font-semibold tracking-wide text-sm">{time}</span>
                    <ChevronRight className={`w-4 h-4 transition-all duration-300 ${selectedTime === time ? "opacity-100 translate-x-0 text-white" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-zinc-500"}`} />
                  </button>
                ))}
              </div>

              <button 
                onClick={handleConfirm}
                disabled={!selectedTime}
                className="w-full mt-auto py-4 bg-primary hover:bg-primary-hover disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-700 disabled:cursor-not-allowed text-white rounded-xl font-bold tracking-widest shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:shadow-none hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 border border-primary/50"
              >
                CONFIRMAR CITA
              </button>
            </div>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center animate-fade-in">
               <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                 <Check className="w-12 h-12 text-emerald-400" />
               </div>
               <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-4">¡Reserva Exitosa!</h2>
               <div className="space-y-2 text-zinc-300 mb-8 max-w-sm">
                 <p>
                   Tu cita para <strong className="text-white">{selectedService?.name}</strong> está súper confirmada.
                 </p>
                 <div className="bg-black/30 w-full p-4 rounded-xl border border-white/5 mt-4">
                    <p className="text-primary font-bold text-lg mb-1">18 de Marzo, 2026</p>
                    <p className="text-white text-xl">{selectedTime}</p>
                 </div>
               </div>
               
               <p className="text-sm text-zinc-500 mb-8">Te hemos enviado un correo con las instrucciones y el link de Google Calendar.</p>
               
               <button 
                onClick={() => { setStep(1); setSelectedTime(null); setSelectedService(null); }}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all"
              >
                Agendar otra cita
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
