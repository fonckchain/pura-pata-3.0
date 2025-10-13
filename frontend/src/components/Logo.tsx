import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
}

export default function Logo({
  width = 40,
  height = 40,
  className = '',
  showText = true
}: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Pura Pata Logo"
        width={width}
        height={height}
        priority
      />
      {showText && (
        <span className="text-2xl font-bold text-primary-600">Pura Pata</span>
      )}
    </Link>
  );
}
