import { getAllTenantsAction } from '@/app/actions/superAdmin';
import { Users } from 'lucide-react';
import TenantsTable from './TenantsTable';

export const dynamic = 'force-dynamic';

export default async function TenantsPage() {
  const tenants = await getAllTenantsAction();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-purple-400" />
            Gestión de Empresas
          </h1>
          <p className="text-zinc-500 mt-1">{tenants.length} empresa(s) registrada(s) en la plataforma.</p>
        </div>
      </div>

      <TenantsTable tenants={tenants} />
    </div>
  );
}
