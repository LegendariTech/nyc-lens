import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Deletion',
  description: 'Instructions for requesting deletion of your BBL Club account and personal data.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function DataDeletionPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Data Deletion Instructions</h1>

        <div className="space-y-6 text-foreground/90 leading-relaxed">
          <p>
            BBL Club respects your privacy and your right to control your personal data.
            If you would like to delete your account and all associated personal data, you can do so
            using any of the methods below.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Option 1: Delete Your Account Directly</h2>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Sign in to your BBL Club account at <a href="https://bblclub.com" className="text-blue-600 hover:underline">bblclub.com</a>.</li>
              <li>Click on your profile icon in the sidebar.</li>
              <li>Select <strong>Manage account</strong>.</li>
              <li>Navigate to the <strong>Security</strong> section.</li>
              <li>Click <strong>Delete account</strong> and confirm.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Option 2: Request Deletion via Email</h2>
            <p>
              Send an email to{' '}
              <a href="mailto:info@bblclub.com" className="text-blue-600 hover:underline">
                info@bblclub.com
              </a>{' '}
              with the subject line <strong>"Data Deletion Request"</strong> and include the email address
              associated with your account. We will process your request within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">What Data Is Deleted</h2>
            <p>When you request account deletion, we will permanently delete:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 mt-2">
              <li>Your account profile and authentication credentials</li>
              <li>Any saved preferences or settings</li>
              <li>Search history and activity data linked to your account</li>
            </ul>
            <p className="mt-4">
              Please note that BBL Club primarily provides access to publicly available NYC property records
              (ACRIS, PLUTO, DOB, HPD). These public records are not personal data and will not be affected
              by your deletion request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Facebook Login Users</h2>
            <p>
              If you signed up using Facebook Login, deleting your BBL Club account will remove all data
              we received from Facebook. You can also remove BBL Club from your Facebook connected apps
              by visiting your{' '}
              <a
                href="https://www.facebook.com/settings?tab=applications"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook App Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
            <p>
              If you have any questions about data deletion, please contact us:
            </p>
            <p className="mt-2"><strong>Email:</strong>{' '}
              <a href="mailto:info@bblclub.com" className="text-blue-600 hover:underline">info@bblclub.com</a>
            </p>
            <p className="mt-1"><strong>Website:</strong>{' '}
              <a href="https://bblclub.com" className="text-blue-600 hover:underline">https://bblclub.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
