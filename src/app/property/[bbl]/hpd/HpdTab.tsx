import { Card, CardContent } from '@/components/ui';

interface HpdTabProps {
  bbl: string;
}

export function HpdTab({ bbl }: HpdTabProps) {
  // TODO: Fetch HPD data based on BBL
  // For now, showing placeholder content

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            HPD Violations
          </h3>
          <p className="text-sm text-foreground/70">
            Housing Preservation and Development violations for BBL {bbl} will be displayed here.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            HPD Registration Contacts
          </h3>
          <p className="text-sm text-foreground/70">
            Housing Preservation and Development registration contacts for BBL {bbl} will be displayed here.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            HPD Permits
          </h3>
          <p className="text-sm text-foreground/70">
            Housing Preservation and Development permits for BBL {bbl} will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
