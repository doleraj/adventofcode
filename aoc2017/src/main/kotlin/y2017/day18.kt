package y2017

import java.util.concurrent.*

fun day18(input: List<String>): Long {
    val solo = Duet(input, 0L)
    return solo.run().get()
}

fun day18Second(input: List<String>): Long {
    val zero = Duet(input, 0L)
    val one = Duet(input, 1L)
    zero.other = one
    one.other = zero
    val f1 = zero.run()
    val f2 = one.run()

    f1.get()
    return f2.get()
}

fun getOrCreateRegisterValue(name: String, registers: MutableMap<String, Long>): Long {
    if (!registers.containsKey(name)) {
        registers[name] = 0
    }
    return registers[name]!!
}

class Duet(val input: List<String>, private val id: Long) {
    private val pattern = Regex("(snd|set|add|mul|mod|rcv|jgz) ([a-z])?(\\d)? ?([a-z])?(-?\\d+)?")
    private val queue: BlockingQueue<Long> = ArrayBlockingQueue<Long>(200)
    var other: Duet? = null
    var sent = 0L
    var waiting = false
    var done = false
    var lastSound = -1L
    var pointer = 0
    private val registers = mutableMapOf(Pair("p", id))

    fun run(): Future<Long> {
        val internalRunnable = Callable<Long> {
            while (pointer >= 0 && pointer < input.size) {
                val command = input[pointer]
                val groups = pattern.matchEntire(command)!!.groups

                var nextPointer = pointer + 1
                val first = if (groups[2] != null) groups[2]!!.value else ""
                val second = if (groups[5] != null) {
                    groups[5]!!.value.toLong()
                } else if (groups[4] != null) {
                    getOrCreateRegisterValue(groups[4]!!.value, registers)
                } else {
                    -1
                }
                val third = if (groups[3] != null) groups[3]!!.value.toInt() else -1

                when (groups[1]!!.value) {
                    "snd" -> if (other != null) {
//                        println("$id sending to other")
                        other!!.queueVal(getOrCreateRegisterValue(first, registers))
                    } else {
                        lastSound = registers[first]!!
                    }
                    "set" -> registers[first] = second
                    "add" -> registers[first] = getOrCreateRegisterValue(first, registers) + second
                    "mul" -> registers[first] = getOrCreateRegisterValue(first, registers) * second
                    "mod" -> registers[first] = getOrCreateRegisterValue(first, registers) % second
                    "rcv" -> if (other != null) {
                        val received = takeFromQueue()
                        if (received == -1L) {
                            other!!.notifyDone()
//                            println("$id is done")
                            return@Callable sent
                        } else {
                            registers[first] = received
                        }
                    } else {
                        if (registers[first]!! > 0) return@Callable lastSound
                    }
                    "jgz" -> if (third > 0 || getOrCreateRegisterValue(first, registers) > 0) nextPointer = pointer + second.toInt()
                    else -> {
                        return@Callable -100
                    }
                }

                pointer = nextPointer
            }
//            println("$id is done")
            other!!.notifyDone()
            return@Callable sent
        }
        return Executors.newSingleThreadExecutor().submit(internalRunnable)
    }

    fun takeFromQueue(): Long {
        if (other!!.waiting || done) {
            return -1
        }

        waiting = true
//        println("$id checking queue - ${queue.count()} in queue")
        val next = queue.take()
//        println("$id got value $next")
        waiting = false
        return next
    }

    fun queueVal(value: Long) {
        queue.offer(value)
        ++sent
    }

    fun notifyDone() {
//        println("$id sees the other is done")
        queue.offer(-1)
        done = true
    }
}