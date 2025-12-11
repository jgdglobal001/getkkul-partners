'use client';

import Link from "next/link";
import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Image
        src="/getkkul-partners-logo.png"
        alt="겟꿀 파트너스 로고"
        width={280}
        height={100}
        className="w-40 md:w-56 h-auto"
        priority
      />
    </Link>
  );
};

export default Logo;

