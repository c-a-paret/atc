# ATC Simulator

# Controls

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
[H][TargetHeading]
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

Examples:

- `H097` to turn and maintain 97 degrees (slightly South East)
- `H225` to turn and maintain 225 degrees (directly South West)
- `H004` to turn and maintain 4 degrees (slightly North East)

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

