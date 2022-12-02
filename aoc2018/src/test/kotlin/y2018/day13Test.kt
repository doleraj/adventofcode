package y2018

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.io.File

class day13Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(Pair(3, 0), day13(parseFile("y2018/day13TestInput.txt")))
    }

    @Test
    fun test2() {
        assertEquals(Pair(3, 7), day13(parseFile("y2018/day13TestInput2.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(Pair(50, 129), day13(parseFile("y2018/day13ActualInput.txt")))
    }

    @Test
    fun test3() {
        assertEquals(Pair(4, 6), day13Second(parseFile("y2018/day13TestInput3.txt")))
    }
    
    @Test
    fun testActualSecond() {
        assertEquals(Pair(73, 69), day13Second(parseFile("y2018/day13ActualInput.txt")))
    }
    
    @Test
    fun testSecondCheat() {
        val foo = Day13(parseFile("y2018/day13ActualInput.txt"))
        assertEquals(Pair(69, 73), foo.solvePart2())
    }
}
