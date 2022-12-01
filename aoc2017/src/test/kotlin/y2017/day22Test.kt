package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File

class day22Test {

    fun parseFile(name: String): List<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        return File(fileUri).readLines()
    }

    @Test
    fun test1() {
        assertEquals(5, day22(7, parseFile("2017/day22TestInput.txt")))
    }

    @Test
    fun test2() {
        assertEquals(41, day22(70, parseFile("2017/day22TestInput.txt")))
    }

    @Test
    fun test3() {
        assertEquals(5587, day22(10000, parseFile("2017/day22TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(5462, day22(10000, parseFile("2017/day22ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(26, day22Second(100, parseFile("2017/day22TestInput.txt")))
    }

    @Test
    fun test2Second() {
        assertEquals(2511944, day22Second(10000000, parseFile("2017/day22TestInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(2512135, day22Second(10000000, parseFile("2017/day22ActualInput.txt")))
    }

}