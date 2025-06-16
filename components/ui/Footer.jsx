export default function Footer() {
  return (
    <footer className="mt-16 border-t pt-6 text-center text-gray-600 text-sm">
      <p>
        © {new Date().getFullYear()} CloudPractitioner. All rights reserved.
      </p>
      <div className="mt-2">
        <a href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </a>
        &nbsp;|&nbsp;
        <a href="/terms" className="hover:underline">
          Terms and Conditions
        </a>
      </div>
    </footer>
  );
}
