package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day10Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals("11", day10Step("1"));
    }

    @Test
    fun test2() {
        assertEquals("21", day10Step("11"));
    }

    @Test
    fun test3() {
        assertEquals("1211", day10Step("21"));
    }

    @Test
    fun test4() {
        assertEquals("111221", day10Step("1211"));
    }

    @Test
    fun test5() {
        assertEquals("312211", day10Step("111221"));
    }

    @Test
    fun testActual() {
        assertEquals(329356, day10("3113322113"))
    }

    @Test
    fun testActualSecond() {
        assertEquals(4666278, day10Second("3113322113"))
    }
}

