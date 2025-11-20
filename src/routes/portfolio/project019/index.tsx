import { component$, useSignal, useStylesScoped$, useVisibleTask$ } from "@builder.io/qwik";
type PhaserNamespace = typeof import("phaser");
type PhaserGame = import("phaser").Game;
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";

const styles = `
  :host {
    display: block;
  }

  .page {
    color: var(--text1, #e2e0d5);
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    line-height: 1.6;
    padding: 2rem 1.25rem 3rem;
    background: radial-gradient(circle at 20% 20%, rgba(82, 84, 80, 0.12), transparent 38%),
      radial-gradient(circle at 80% 0%, rgba(86, 94, 92, 0.1), transparent 30%),
      linear-gradient(135deg, #111, #0f0f0f 45%, #151515);
    min-height: 100vh;
  }

  .layout-shell {
    margin: 0 auto;
    max-width: 960px;
    width: 100%;
  }

  h1 {
    font-size: clamp(2rem, 3vw, 2.5rem);
    letter-spacing: 0.04em;
    color: #f0ede2;
    margin-bottom: 0.25rem;
  }

  p {
    color: var(--text2, #c7c3b8);
    max-width: 70ch;
  }

  .game-shell {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 22px;
    background: rgba(34, 34, 34, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 18px 80px rgba(0, 0, 0, 0.35);
  }

  .game-frame {
    position: relative;
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: linear-gradient(180deg, #1c1b1b, #131313 68%, #0f0f0f);
  }

  #bunker-game {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    display: block;
  }

  .status {
    margin-top: 0.75rem;
    color: #d7d2c6;
    font-family: "DM Mono", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    letter-spacing: 0.04em;
    font-size: 0.95rem;
  }
`;

export default component$(() => {
  useStylesScoped$(styles);
  const status = useSignal("Loading Phaser bunker...");

  // Load Phaser on the client and bootstrap the bunker scene
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    let game: PhaserGame | undefined;
    let cleanedUp = false;

    const loadPhaser = () =>
      new Promise<PhaserNamespace>((resolve, reject) => {
        if ((globalThis as any).Phaser) {
          resolve((globalThis as any).Phaser as PhaserNamespace);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js";
        script.async = true;
        script.onload = () => resolve((globalThis as any).Phaser);
        script.onerror = () => reject(new Error("Failed to load Phaser"));
        document.head.appendChild(script);
      });

    const boot = async () => {
      try {
        const PhaserLib = (await loadPhaser()) as PhaserNamespace;
        if (!PhaserLib || cleanedUp) return;

        status.value = "Explore the bunker. Move with arrows or WASD.";

        const TILE = 48;
        const ROOM_COLS = 16;
        const ROOM_ROWS = 13;
        const DOOR_START = Math.floor(ROOM_COLS / 2) - 1;
        const DOOR_WIDTH = 2;

        class BunkerStartScene extends PhaserLib.Scene {
          private cursors!: import("phaser").Types.Input.Keyboard.CursorKeys;
          private keys!: Record<string, import("phaser").Input.Keyboard.Key>;
          private player!: import("phaser").GameObjects.Rectangle;
          private exitZone!: import("phaser").GameObjects.Zone;
          private exitHint!: import("phaser").GameObjects.Text;
          private wallBodies!: import("phaser").Physics.Arcade.StaticGroup;

          constructor() {
            super("BunkerStartScene");
          }

          create() {
            this.cameras.main.setBackgroundColor("#11100f");
            this.wallBodies = this.physics.add.staticGroup();
            this.buildRoom();
            this.createProps();
            this.createPlayer();
            this.createExit();
            this.createCamera();
            this.cursors = this.input.keyboard!.createCursorKeys();
            this.keys = this.input.keyboard!.addKeys("W,A,S,D,E") as Record<
              string,
              import("phaser").Input.Keyboard.Key
            >;
          }

          // Generate simple grid for floor and walls
          private buildRoom() {
            const room = Array.from({ length: ROOM_ROWS }, () =>
              Array.from({ length: ROOM_COLS }, () => "floor" as "floor" | "wall" | "door"),
            );

            for (let row = 0; row < ROOM_ROWS; row++) {
              for (let col = 0; col < ROOM_COLS; col++) {
                const isBorder = row === 0 || col === 0 || row === ROOM_ROWS - 1 || col === ROOM_COLS - 1;
                if (isBorder) {
                  room[row][col] = "wall";
                }
              }
            }

            for (let offset = 0; offset < DOOR_WIDTH; offset++) {
              room[ROOM_ROWS - 1][DOOR_START + offset] = "door";
            }

            const graphics = this.add.graphics();
            graphics.lineStyle(1, 0x1f1b18, 0.45);

            for (let row = 0; row < ROOM_ROWS; row++) {
              for (let col = 0; col < ROOM_COLS; col++) {
                const x = col * TILE;
                const y = row * TILE;
                const tile = room[row][col];

                if (tile === "wall") {
                  graphics.fillStyle(0x26221f, 1);
                  graphics.fillRect(x, y, TILE, TILE);
                  graphics.fillStyle(0x2f2925, 1);
                  graphics.fillRect(x + 4, y + 4, TILE - 8, TILE - 8);

                  const wallRect = this.add.rectangle(x + TILE / 2, y + TILE / 2, TILE, TILE);
                  this.physics.add.existing(wallRect, true);
                  this.wallBodies.add(wallRect);
                } else {
                  const shade = tile === "door" ? 0x3e3a36 : 0x3b3832;
                  graphics.fillStyle(shade, 1);
                  graphics.fillRect(x, y, TILE, TILE);
                  graphics.fillStyle(0x4b453e, 0.25);
                  graphics.fillRect(x + 6, y + 6, TILE - 12, TILE - 12);
                }

                graphics.strokeRect(x, y, TILE, TILE);
              }
            }

            const roomWidth = ROOM_COLS * TILE;
            const roomHeight = ROOM_ROWS * TILE;
            this.physics.world.setBounds(0, 0, roomWidth, roomHeight);
          }

          // Create basic props using simple rectangles
          private createProps() {
            const bed = this.add.rectangle(TILE * 3, TILE * 3.5, TILE * 2.8, TILE * 1.2, 0x4a463e, 1).setOrigin(0.5);
            this.add.rectangle(bed.x, bed.y + 6, bed.width - 12, bed.height - 10, 0x615a52, 1).setOrigin(0.5);

            const locker = this.add.rectangle(TILE * 11.5, TILE * 3.4, TILE * 1.2, TILE * 2.4, 0x3d3a32, 1).setOrigin(0.5);
            this.add.rectangle(locker.x, locker.y, locker.width - 10, locker.height - 10, 0x565148, 0.9).setOrigin(0.5);

            const terminalBase = this.add.rectangle(TILE * 8, TILE * 5, TILE * 2, TILE * 1, 0x2e2c27, 1).setOrigin(0.5);
            this.add.rectangle(terminalBase.x, terminalBase.y - 18, TILE * 1.6, TILE * 1, 0x3c3c35, 1).setOrigin(0.5);
            this.add.rectangle(terminalBase.x, terminalBase.y - 18, TILE * 1.4, TILE * 0.6, 0x6b7760, 0.8).setOrigin(0.5);
            this.add.rectangle(terminalBase.x + 6, terminalBase.y + 8, TILE * 0.8, TILE * 0.16, 0x746d64, 0.8).setOrigin(0.5);
          }

          // Create a small player rectangle with highlight
          private createPlayer() {
            const startX = TILE * (ROOM_COLS / 2);
            const startY = TILE * (ROOM_ROWS / 2 - 1);
            this.player = this.add.rectangle(startX, startY, TILE * 0.6, TILE * 0.9, 0x9ca08c, 1);
            this.player.setStrokeStyle(2, 0xd5d8c8, 0.9);
            this.player.setOrigin(0.5, 0.6);

            this.physics.add.existing(this.player);
            const body = this.player.body as import("phaser").Physics.Arcade.Body;
            body.setCollideWorldBounds(true);
            body.setSize(TILE * 0.6, TILE * 0.6);
            body.setOffset(-TILE * 0.3 + this.player.width / 2, -TILE * 0.3 + this.player.height / 2);

            this.physics.add.collider(this.player, this.wallBodies);
          }

          // Place exit trigger at the south door
          private createExit() {
            const doorCenterX = (DOOR_START + DOOR_WIDTH / 2) * TILE;
            const doorCenterY = (ROOM_ROWS - 0.5) * TILE;
            this.exitZone = this.add.zone(doorCenterX, doorCenterY, TILE * DOOR_WIDTH, TILE * 0.8);
            this.physics.add.existing(this.exitZone);
            const exitBody = this.exitZone.body as import("phaser").Physics.Arcade.Body;
            exitBody.setAllowGravity(false);
            exitBody.setImmovable(true);

            this.exitHint = this.add
              .text(TILE * 0.7, TILE * 0.7, "Press E to exit the bunker", {
                fontFamily: "DM Mono, monospace",
                fontSize: "16px",
                color: "#d6d1c3",
              })
              .setScrollFactor(0)
              .setVisible(false);
          }

          // Keep the camera following the player across the room
          private createCamera() {
            const roomWidth = ROOM_COLS * TILE;
            const roomHeight = ROOM_ROWS * TILE;
            this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);
            this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
          }

          update() {
            const body = this.player.body as import("phaser").Physics.Arcade.Body;
            const speed = 165;
            body.setVelocity(0);

            const isLeft = this.cursors.left?.isDown || this.keys["A" as any]?.isDown;
            const isRight = this.cursors.right?.isDown || this.keys["D" as any]?.isDown;
            const isUp = this.cursors.up?.isDown || this.keys["W" as any]?.isDown;
            const isDown = this.cursors.down?.isDown || this.keys["S" as any]?.isDown;

            if (isLeft) body.setVelocityX(-speed);
            else if (isRight) body.setVelocityX(speed);

            if (isUp) body.setVelocityY(-speed);
            else if (isDown) body.setVelocityY(speed);

            body.velocity.normalize().scale(speed);

            const atExit = this.physics.overlap(this.player, this.exitZone);
            this.exitHint.setVisible(atExit);

            if (atExit && PhaserLib.Input.Keyboard.JustDown(this.keys["E" as any])) {
              console.log("Exiting bunker...");
            }
          }
        }

        game = new PhaserLib.Game({
          type: PhaserLib.AUTO,
          width: 800,
          height: 600,
          parent: "bunker-game",
          backgroundColor: "#0f0f0f",
          physics: {
            default: "arcade",
            arcade: {
              gravity: { x: 0, y: 0 },
              debug: false,
            },
          },
          scene: [BunkerStartScene],
        });
      } catch (error) {
        console.error(error);
        status.value = "Unable to load Phaser. Please refresh.";
      }
    };

    void boot();

    return () => {
      cleanedUp = true;
      if (game) {
        game.destroy(true);
      }
    };
  });

  return (
    <div class="page">
      <div class="layout-shell">
        <header>
          <p class="text-xs uppercase tracking-[0.3em] text-[var(--primary,#9cc2a5)]">Project 019 · Phaser</p>
          <h1>Fallout-inspired Bunker Prototype</h1>
          <p>
            A minimal Phaser 3 starting scene for an isometric-leaning bunker interior. Everything is built with code-driven
            rectangles—no external assets—so you can extend the layout, props, and interactions without leaving the
            JavaScript file.
          </p>
        </header>

        <section class="game-shell">
          <div class="game-frame">
            <div id="bunker-game" aria-label="Isometric bunker Phaser demo" />
          </div>
          <p class="status">{status.value}</p>
        </section>
      </div>
    </div>
  );
});

export const head = buildHead(
  `Project 019 - ${siteConfig.metadata.title}`,
  "Fallout-inspired bunker prototype built in Phaser 3 with simple shapes, WASD movement, wall collisions, and an exit prompt.",
);
