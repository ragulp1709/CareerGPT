"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  Target,
  Map,
  FileText,
  MessageSquare,
  Sword,
  Briefcase,
  Settings,
  TrendingUp,
  Code,
  GitBranch,
  User,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentUser } from "@/contexts/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard",          label: "Dashboard",       icon: LayoutDashboard },
  { href: "/dashboard/career",   label: "Career Insights", icon: TrendingUp      },
  { href: "/dashboard/skills",   label: "Skill Gap",       icon: Target          },
  { href: "/dashboard/roadmap",  label: "Roadmap",         icon: Map             },
  { href: "/dashboard/resume",   label: "Resume Analyzer", icon: FileText        },
  { href: "/dashboard/chat",     label: "AI Mentor",       icon: MessageSquare   },
  { href: "/dashboard/interview",label: "Interview Arena", icon: Sword           },
  { href: "/dashboard/jobs",     label: "Job Matching",    icon: Briefcase       },
  { href: "/dashboard/projects", label: "Projects",        icon: Code            },
  { href: "/dashboard/github",   label: "GitHub Analyzer", icon: GitBranch       },
  { href: "/dashboard/settings", label: "Settings",        icon: Settings        },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();

  const handleLogout = () => {
    document.cookie = "dev_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    router.push("/sign-in");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border/50 bg-sidebar flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center gap-2 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold gradient-text">CareerGPT</span>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="w-7 h-7">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {user?.firstName?.[0] ?? <User className="w-3 h-3" />}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {user?.firstName ?? "User"}
            </span>
          </div>
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
