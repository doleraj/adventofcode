package y2017

import java.util.Arrays



fun day23(input: List<String>): Long {
    val prog = Day23Program(input)
    return prog.run()
}

fun day23Second(primes: List<String>): Int {
    return ((109900..126900 step 17).toList().filter({number -> !primes.contains(number.toString())}).count())
}


class Day23Program(val input: List<String>, regA: Long = 0) {
    private val ram = input.map { (it + " .").split(" ").toTypedArray() }.toMutableList()
    private val regs = longArrayOf(regA, 0, 0, 0, 0, 0, 0, 0)
    private var pc = 0

    var count = 0L

    private fun isReg(s: String): Boolean = s[0] in 'a'..'z'

    private fun getValue(s: String): Long = when (isReg(s)) {
        true -> regs[s[0] - 'a']
        false -> s.toLong()
    }

    fun run(): Long {
        while (pc < ram.size) {
            val (inst, op1, op2) = ram[pc]
            println("$inst $op1 $op2")
            when (inst) {
                "set" -> if (isReg(op1)) regs[op1[0] - 'a'] = getValue(op2)
                "sub" -> if (isReg(op1)) regs[op1[0] - 'a'] -= getValue(op2)
                "mul" -> if (isReg(op1)) { regs[op1[0] - 'a'] *= getValue(op2); count++ }
                "jnz" -> if (getValue(op1) != 0L) pc += getValue(op2).toInt() - 1
            }
            pc++
            println(Arrays.toString(regs))
        }
        return count
    }
}