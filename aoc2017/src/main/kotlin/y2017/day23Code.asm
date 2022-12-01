set b 99 ; a = 1, b = 99
set c b ; a = 1, b = 99, c = 99
jnz a 2 ;if a, goto fucklife
jnz 1 5 ;goto programsetup
fucklife: mul b 100 ; a = 1, b = 9900, c = 99
sub b -100000 ; a = 1, b = 109900 c = 99
set c b ; a = 1, b = 109900 c = 109900
sub c -17000 ; a = 1, b = 109900 c = 126900
programsetup: set f 1 ; a = 1, b = 109900 c = 126900, f = 1
set d 2 ; a = 1, b = 109900 c = 126900, d = 2, f = 1
secondaryloop: set e 2 ; a = 1, b = 109900 c = 126900, d = 2, e = 2, f = 1
mainloop: set g d ; a = 1, b = 109900 c = 126900, d = 2, e = 2, f = 1, g = 2
mul g e
sub g b
jnz g 2 ; if ((d * e) == 109900), f = 0
set f 0
sub e -1
set g e
sub g b
jnz g -8
sub d -1
set g d
sub g b
jnz g -13 ; if (++e != b) goto mainloop, else if (++d != b) goto secondaryloop //
jnz f 2 ; if (f == 0) h++ // if there were any times where d * e = b, increment
sub h -1
set g b
sub g c
jnz g 2
jnz 1 3 ; if (b - c == 0) exit program, else b + 17 // We will run through the programsetup loop 1000 times
sub b -17
jnz 1 -23 ; jump programsetup

for (int b = 109900; b < 126900; b += 17) {
    for (int d = 2; d < b; d++) {
        for (int e = 2; e < b; e++) {
            if (d * e == b) {
                h++
            }
        }
    }
}

