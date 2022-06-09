# ATC Simulator

# Gameplay

- Your goal is to direct as many aeroplanes as possible to land safely.
- If an aeroplane is directed outside the map it will be removed from the game play.
- There is currently no penalty for breaching aircraft proximity limits or landing at incorrect locations.

# Interface

## Aeroplanes

![Aeroplane Info](images/aeroplane_info.png?raw=true)

Aeroplanes are shown as a circle with a line trailing their direction of travel, i.e.: the line points away from the
direction the aeroplane is facing.

The length of the trailing line shows the speed of the aeroplane. The longer the line, the faster the speed.

There are four informational elements that accompany the aeroplane:

1. The call sign (`BA123`)
2. The current heading (`90`)
3. The current heading (`200`)
4. The current altitude as flight level (see below) (`30`)

## Runways

![Runway](images/runway.png?raw=true)

Runways are shown as mint green lines with their runway labels on each end. For example :

- `9L` means the runway has a heading of `90` degrees and is to the `left` of other runways
- `27R` means the runway has a heading of `270` degrees and is to the `right` of other runways

One runway line comprises two available runways; each accessible from each end of the runway line (`9R` and `27L` are
the same runway, just approached from different ends).

![Runway](images/ils_feather.png?raw=true)
The end of each runway has a 'feather' extending from it. This denotes the approach vector and acts as a guide to
position an aeroplane for landing.

The far end of each feather has a straight line down its centre pointing at the runway, extending about halfway along
the feather. This is provided for your convenience and a visual representation of the zone within which an aeroplane can
accept a 'Cleared to Land' command. Note that other constraints to accepting a landing clearance also apply (see below).

# Controls

Pause the game by pressing this button in the top right corner:

![Play/Pause](images/play_pause.png?raw=true)

# Commands

## Overview

Control aeroplanes by typing command strings into the command input and pressing `Enter` to submit them.

Type the call sign of the aeroplane to which you want to issue a command in the box and type your command. Alternatively
you can click the aeroplane on the map and automatically populate the command input with the call sign.

Once you have issued a command, a message will show for a short time about which commands were accepted. Some values are
not valid, for example altitudes that are too high, speeds that are too low, waypoints that do not exist, etc.

Press the `ArrowUp` key to select the aeroplane to which you most recently issued a command.

Commands follow this structure:

```text
[CallSign][[CommandPrefix][TargetValue]|[StandaloneCommand]]
```

### Sequential commands

Sequential commands for the same action (speed, altitude, heading, etc.) override previously set, active actions. So if
you have directed an aeroplane to turn to heading 265, and it is in the process of doing so, but then you issue a new
command to head to the Ockham waypoint, the aeroplane will comply with the new command.

## Call signs

Call signs identify an aircraft. These are displayed alongside the aeroplane on the map. Examples of aeroplane call
signs are `BA123`, `VS462`, etc.

## Speed Commands

Speed commands follow the structure:

```text
S[TargetSpeed]
```

Examples:

- `S200` to maintain a speed of 200 knots
- `S180` to maintain a speed of 180 knots
- `S440` to maintain a speed of 440 knots

## Altitude Commands

Speed commands follow the structure:

```text
[C|D][TargetSpeed]
```

- `C` for climb
- `D` for descend

Note: Either `C` or `D` will change the aeroplane's altitude irrespective of whether it needs to climb or descend. The
command prefixes are interchangeable.

Altitudes are specified in "flight level". This is the altitude expressed in hundreds of feet

For example:

- Flight level `200` -> `20,000ft`
- Flight level `20` -> `2,000ft`
- Flight level `32` -> `3,200ft`
- Flight level `55` -> `5,500ft`
- Flight level `2` -> `200ft`

Examples:

- `C200` to maintain an altitude of 20,000ft
- `D98` to maintain an altitude of 9,800ft
- `C174` to maintain an altitude of 17,400ft

## Heading Commands

Heading commands follow the structure:

```text
H[TargetHeading]
```

Headings are specified in **three digit** degrees around a compass rose.

For example:

- `000` -> Directly North
- `360` -> Directly North
- `180` -> Directly South
- `090` -> Directly East
- `270` -> Directly West
- `45` -> Directly North East

The rate at which an aeroplane turns varies based on its speed and weight. The heavier and faster an aeroplane, the
slower it turns.

The aeroplane will always turn the shortest distance to the desired heading unless there is ambiguity, in which case it
will default to right.

Specifying a heading will override an existing heading command and cancel an existing waypoint command (see below).

Examples:

- `H097` to turn and maintain 97 degrees (slightly South East)
- `H225` to turn and maintain 225 degrees (directly South West)
- `H004` to turn and maintain 4 degrees (slightly North East)

## Waypoint Commands

Waypoint commands follow the structure:

```text
>[TargetWaypoint]
```

Waypoints are specified by their **three character** IDs.

![Waypoint Example](images/waypoint.png?raw=true)

The aeroplane will always turn the shortest angular distance to the heading required to point to the waypoint unless
there is ambiguity, in which case it will default to right.

Specifying a waypoint will override an existing waypoint command and cancel an existing heading command.

Examples:

- `>LAM` -> Fly directly to Lambourne
- `>EPM` -> Fly directly to Epsom
- `>CPT` -> Fly directly to Compton
- `>OCK` -> Fly directly to Ockham

## Landing clearance commands

Landing clearance is issued in the following structure:

```text
.[Targetrunway].
```

The aeroplane must conform to certain requirements to accept a landing clearance. It must be:

1. Within the horizontal zone shown by the inner line of the runway feather (see above)
2. At least within the width of the landing feather
3. At or below 3000ft
4. At or below 200 knots
5. Facing within 10 degrees of the runway heading (e.g.: 90 ±10degrees for runway `9L` or `9R`)

A landing clearance overrides all other current actions and the aeroplane will manage the approach heading, speed and
altitude on its own. Once the aeroplane has landed it will be removed from the map.

Examples:

- `.9L.` -> Cleared to land runway 9L
- `.24R.` -> Cleared to land runway 24L

## Example commands

Direct BA123 to maintain speed of 200 knots, fly heading 200 degrees and climb to 3000ft:

```text
BA123S200H270C3
```

Clear VS462 to land on runway 27L:

```text
VS462.27L.
```

Direct LH822 to fly direct to waypoint `CPT` and descent to 12000ft

```text
LH822>CPTD12
```

## Developing

See [Makefile](Makefile) for relevant commands to get started.

