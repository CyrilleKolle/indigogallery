import { cn } from "@/utilities";
import { motion } from "framer-motion";

export const HamburgerIcon: React.FC<{ open: boolean; toggle: () => void }> = ({
  open,
  toggle,
}) => (
  <button
    aria-label={open ? "Close menu" : "Open menu"}
    onClick={toggle}
    className={ICON_BASE}
    data-testid="hamburger-icon"
  >
    {["top", "middle", "bottom"].map((bar) => (
      <motion.span
        key={bar}
        className={BAR}
        initial={false}
        animate={open ? "open" : "closed"}
        variants={{
          closed: { rotate: 0, y: 0, opacity: 1 },
          open: [
            bar === "top"
              ? { rotate: 45, y: 6 }
              : bar === "middle"
                ? { opacity: 0 }
                : { rotate: -45, y: -6 },
          ][0],
        }}
        transition={{
          duration: 0.2,
          ease: [0.8, 0.77, 0.77, 0.8],
          type: "tween",
        }}
      />
    ))}
  </button>
);
const BAR = "block h-[2px] w-5 bg-gray-300 origin-center";
const ICON_BASE = cn(
  "relative z-[400] flex h-10 w-10 flex-col items-center justify-center",
  "md:hidden gap-1 self-right"
);
