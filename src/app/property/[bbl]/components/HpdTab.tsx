interface HpdTabProps {
  bbl: string;
}

export function HpdTab({ bbl }: HpdTabProps) {
  // TODO: Fetch HPD data based on BBL
  // For now, showing placeholder content

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          HPD Violations
        </h3>
        <p className="text-sm text-foreground/70">
          Housing Preservation and Development violations for BBL {bbl} will be displayed here.
        </p>
      </div>

      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          HPD Registration Contacts
        </h3>
        <p className="text-sm text-foreground/70">
          Housing Preservation and Development registration contacts for BBL {bbl} will be displayed here.
        </p>
      </div>

      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          HPD Permits
        </h3>
        <p className="text-sm text-foreground/70">
          Housing Preservation and Development permits for BBL {bbl} will be displayed here.
        </p>
      </div>
    </div>
  );
}

