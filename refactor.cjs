const fs = require('fs');

let content = fs.readFileSync('src/components/BookingWidget.tsx', 'utf-8');

// Colors & Themes
content = content.replace(/bg-black\/95/g, 'bg-slate-50 dark:bg-black/95');
content = content.replace(/bg-white\/5(?!\d)/g, 'bg-white dark:bg-white/5'); // avoid matching bg-white/50
content = content.replace(/border-white\/10/g, 'border-slate-200 dark:border-white/10');
content = content.replace(/border-white\/5(?!\d)/g, 'border-slate-200 dark:border-white/5');
content = content.replace(/text-zinc-300/g, 'text-slate-600 dark:text-zinc-300');
content = content.replace(/text-zinc-400/g, 'text-slate-500 dark:text-zinc-400');
content = content.replace(/text-zinc-500/g, 'text-slate-400 dark:text-zinc-500');
content = content.replace(/bg-black\/20/g, 'bg-slate-100 dark:bg-black/20');
content = content.replace(/bg-black\/30/g, 'bg-slate-200 dark:bg-black/30');
content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
content = content.replace(/border text-slate-900/g, 'border text-white'); // fix for button texts if needed

// Add imports
if (!content.includes('useTranslations')) {
  content = content.replace('import { useState } from "react";', `import { useState } from "react";\nimport { useTranslations } from "next-intl";\nimport { ThemeToggle } from "./ThemeToggle";\nimport { LangToggle } from "./LangToggle";`);
}

// Add hook
if (!content.includes('const t = useTranslations')) {
  content = content.replace('const [step, setStep] = useState(1);', `const t = useTranslations('BookingWidget');\n  const [step, setStep] = useState(1);`);
}

// Add Toggles to Header and fix gradient text
if (!content.includes('<ThemeToggle')) {
  content = content.replace(
    /<h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white\/50">\s*\{tenantName\}\s*<\/h1>/g,
    `<div className="flex items-center justify-between w-full">
              <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-white/50">
                {tenantName}
              </h1>
              <div className="flex gap-2">
                <ThemeToggle />
                <LangToggle />
              </div>
            </div>`
  );
}

// Replace exact texts
const replacers = {
  'Paso 1: ¿Dónde te atenderemos?': '{t("title_branch")}',
  'Visita una Sucursal': '{t("visit_branch")}',
  'Reserva inmediata en nuestras instalaciones': '{t("visit_branch_desc")}',
  'O vamos a ti': '{t("or_home")}',
  'Servicio a Domicilio': '{t("home_service")}',
  'Termina de agendar vía WhatsApp (Requiere 7 días de anticipación)': '{t("home_service_desc")}',
  'Paso 2: Elige tu Servicio': '{t("title_service")}',
  'Incluye:': '{t("includes")}',
  'No incluye:': '{t("excludes")}',
  'Paso 3: Especialista y Fecha': '{t("title_specialist")}',
  '¿Con quién te atiendes?': '{t("who_attends")}',
  'Cualquiera<br/>Libre': '{t("anyone")}<br/>{t("anyone_desc")}',
  'Días disponibles': '{t("dates")}',
  'Fechas (+7 días anticipación)': '{t("dates_home")}',
  'Horarios</p>': '{t("times")}</p>',
  '>Ocupado<': '>{t("occupied")}<',
  'IR A MIS DATOS': '{t("go_to_data")}',
  'Paso 4: Tus Datos': '{t("title_data")}',
  'Nombre Completo': '{t("full_name")}',
  'Correo Electrónico *': '{t("email")}',
  'Teléfono * (Solo números)': '{t("phone")}',
  'No necesitas crear cuenta. Solo requerimos estos datos de contacto obligatorios.': '{t("no_account")}',
  'FINALIZAR RESERVA': '{t("finish_booking")}',
  'CONFIRMAR POR WHATSAPP': '{t("confirm_whatsapp")}',
  '¡Reserva Exitosa!': '{t("success")}',
  '¡Redirigiendo!': '{t("redirecting")}',
  'Volver al inicio': '{t("back_to_start")}',
  'Fecha a confirmar': '{t("date_tbd")}',
  'Tu Cita:': '{t("your_appointment")}'
};

for (const [key, value] of Object.entries(replacers)) {
  content = content.replaceAll(key, value);
}

// Dynamic text replacers
content = content.replace(
  /Tu solicitud de \{selectedService\?\.name\} a domicilio está en camino de ser confirmada\. Serás redirigido a conversar con \{tenantName\}\./g,
  '{t("redirecting_desc", { service: selectedService?.name, tenant: tenantName })}'
);

content = content.replace(
  /Hola \{guestName\.split\(\' \'\)\[0\]\}, tu cita presencial en \{selectedBranch\?\.name\} para \{selectedService\?\.name\} está confirmada\./g,
  '{t("success_desc", { name: guestName.split(" ")[0], branch: selectedBranch?.name, service: selectedService?.name })}'
);

content = content.replace(
  /\{modality === 'domicilio' \? 'A Domicilio' : `Sucursal: \$\{selectedBranch\?\.name\}`\}/g,
  `{modality === 'domicilio' ? t("home_address") : t("branch_address", { branch: selectedBranch?.name })}`
);

content = content.replace(
  /Con \{selectedStaff\.name\}/g,
  `{t("with_staff", { staff: selectedStaff.name })}`
);

fs.writeFileSync('src/components/BookingWidget.tsx', content);
console.log('Refactor done');
