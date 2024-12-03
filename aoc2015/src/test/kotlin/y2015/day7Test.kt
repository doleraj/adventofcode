package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.day6
import y2015.day6Second
import y2015.day7
import y2015.day7Second
import java.io.File

class day7Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(123.toUShort(), day7("a", listOf("123 -> a")))
    }

    @Test
    fun test2() {
        assertEquals(72.toUShort(), day7("a", listOf("123 -> x", "456 -> y", "x AND y -> a")))
    }

    @Test
    fun test3() {
        assertEquals(507.toUShort(), day7("a", listOf("123 -> x", "456 -> y", "x OR y -> a")))
    }

    @Test
    fun test4() {
        assertEquals(65412.toUShort(), day7("a", listOf("123 -> x", "NOT x -> a")))
    }

    @Test
    fun test5() {
        assertEquals(492.toUShort(), day7("a", listOf("123 -> x", "x LSHIFT 2 -> a")))
    }

    @Test
    fun test6() {
        assertEquals(30.toUShort(), day7("a", listOf("123 -> x", "x RSHIFT 2 -> a")))
    }

    @Test
    fun test7() {
        val instructions = listOf("123 -> x", "456 -> y", "x AND y -> d", "x OR y -> e", "x LSHIFT 2 -> f", "y RSHIFT 2 -> g", "NOT x -> h", "NOT y -> i");
        assertEquals(72.toUShort(), day7("d", instructions));
        assertEquals(507.toUShort(), day7("e", instructions));
        assertEquals(492.toUShort(), day7("f", instructions));
        assertEquals(114.toUShort(), day7("g", instructions));
        assertEquals(65412.toUShort(), day7("h", instructions));
        assertEquals(65079.toUShort(), day7("i", instructions));
        assertEquals(123.toUShort(), day7("x", instructions));
        assertEquals(456.toUShort(), day7("y", instructions));
    }

    @Test
    fun testActual() {
        assertEquals(46_065.toUShort(), day7("a", parseFile("y2015/day07ActualInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(14_134.toUShort(), day7Second("a", parseFile("y2015/day07ActualInput.txt")))
    }
}

