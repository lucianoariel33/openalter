import { formatNumber } from "@curiousleaf/utils"
import Image from "next/image"
import type { HTMLAttributes } from "react"
import { config } from "~/config"
import { cx } from "~/utils/cva"

export const NewsletterProof = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx(
        "flex flex-wrap items-center justify-center text-center gap-y-1 -space-x-1.5",
        className,
      )}
      {...props}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Image
          key={index}
          src={`/users/${index + 1}.webp`}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          className="size-7 border-2 border-card rounded-full"
        />
      ))}

      <p className="w-full text-xs text-muted">
        Join {formatNumber(config.stats.subscribers, "standard")}+ open source enthusiasts
      </p>
    </div>
  )
}
