package y2018

import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File

class day1Test {
    fun parseFile(name: String): Array<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0) {""}
        File(fileUri).forEachLine { line -> lines.add(line)  }
        return lines.toTypedArray()
    }

    @Test
    fun test1() {
        assertEquals(-1, day1(Array(1) {"-1"}))
    }

    @Test
    fun test2() {
        assertEquals(3, day1(arrayOf("+1", "+1", "+1")))
    }

    @Test
    fun test3() {
        assertEquals(0, day1(arrayOf("+1", "+1", "-2")))
    }

    @Test
    fun test4() {
        assertEquals(-6, day1(arrayOf("-1", "-2", "-3")))
    }

    @Test
    fun testActual() {
        assertEquals(445, day1(parseFile("y2018/day01ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(2, day1Second(arrayOf("+1", "-2", "+3", "+1")))
    }

    @Test
    fun test2Second() {
        assertEquals(0, day1Second(arrayOf("+1", "-1")))
    }

    @Test
    fun test3Second() {
        assertEquals(10, day1Second(arrayOf("+3", "+3", "+4", "-2", "-4")))
    }

    @Test
    fun test4Second() {
        assertEquals(5, day1Second(arrayOf("-6", "+3", "+8", "+5", "-6")))
    }

    @Test
    fun test5Second() {
        assertEquals(14, day1Second(arrayOf("+7", "+7", "-2", "-7", "-4")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(219, day1Second(parseFile("y2018/day01ActualInput.txt")))
    }
}