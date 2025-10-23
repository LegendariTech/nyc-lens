interface DobTabProps {
  bbl: string;
}

export function DobTab({ bbl }: DobTabProps) {
  // TODO: Fetch DOB data based on BBL
  // For now, showing placeholder content

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          DOB Permits
        </h3>
        <p className="text-sm text-foreground/70">
          Department of Buildings permits for BBL {bbl} will be displayed here.
        </p>
      </div>

      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          DOB Violations
        </h3>
        <p className="text-sm text-foreground/70">
          Department of Buildings violations for BBL {bbl} will be displayed here.
        </p>
      </div>

      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          DOB Complaints
        </h3>
        <p className="text-sm text-foreground/70">
          Department of Buildings complaints for BBL {bbl} will be displayed here.
        </p>
      </div>

      <div className="rounded-lg border border-foreground/10 bg-background p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Certificate of Occupancy
        </h3>
        <p className="text-sm text-foreground/70">
          Certificate of Occupancy information for BBL {bbl} will be displayed here.
        </p>
      </div>
    </div>
  );
}

