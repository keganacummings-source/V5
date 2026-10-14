import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { authClient } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { staticSignIn, staticSignUp, useStaticAccount } from "@/lib/auth/static-account";
import { ALCHEMY_RECIPES, CLASS_RACE, ENCHANT_BY_ID, ITEM_BY_ID, RACES, enchantText, equipmentStats, type TypeId } from "@/game/content";
import { CLASSES, classGendered } from "@/game/classes";
import { CharacterSheet, ClassPicker, LobbyPanel, type Pick } from "@/components/character-ui";
import { FloatWin, narrow, vh, vw } from "@/components/float-win";
import { HudActions, Vitals, VerseBar } from "@/components/hud";
import { isPinned, loadAccountLayout, resetLayout, useLayout } from "@/game/ui-layout";
import { loadCloudSave, writeCloudSave } from "@/game/cloud-client";
import { bindCloud, cloudReady, ingestCloud, noteArena, noteHardcore, noteHunt, readArenaLocal } from "@/game/account-save";
import { postGrave } from "@/game/social-client";
import type { GraveBody } from "@/game/social-types";
import { bestFood } from "@/game/item-use";
import { CAMP_RECIPE_LIST } from "@/game/survival";
import { DesignerMode } from "@/components/designer-mode";
import { ArenaScreen } from "@/components/arena-ui";
import { AccountChip, Boards, ChatDock, DuelBanner, Hub, Options } from "@/components/hub-ui";
import { getSnap, subscribe, TurbzGame } from "@/game/engine";

/** Static (dreamdaw.com) build: accounts + saves live in the worker (see /worker). */
const LOCAL = import.meta.env.VITE_STATIC_HUNT === "1";

function useSnap() {
  return useSyncExternalStore(subscribe, getSnap, getSnap);
}

export function TurbzApp() {
  const auth = useCurrentUserState();
  const acct = useStaticAccount();
  const user = LOCAL ? acct.user : auth.user;
  const isPending = LOCAL ? acct.pending : auth.isPending;
  if (isPending) {
    return (
      <main className="game-root grid place-items-center overflow-auto p-3">
        <div className="screen-card px-panel my-auto w-full max-w-md overflow-auto p-4">
          <p className="font-display text-xs text-blood">TURBZ API</p>
          <h1 className="font-display mt-3 text-xl text-bone">TURBZ</h1>
          <p className="mt-3 text-dim">Checking your account. Autosave and lobbies wait on the veil.</p>
        </div>
      </main>
    );
  }
  if (!user) return <ApiGate />;
  return <Hunt />;
}
