package y2018

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.io.File

class day15Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        val day15 = Day15(parseFile("y2018/day15TestInput.txt"))
        assertEquals(36334, day15.solvePart1())
    }

    @Test
    fun test2() {
        val day15 = Day15(parseFile("y2018/day15TestInput2.txt"))
        assertEquals(39514, day15.solvePart1())
    }

    @Test
    fun test3() {
        val day15 = Day15(parseFile("y2018/day15TestInput3.txt"))
        assertEquals(27755, day15.solvePart1())
    }

    @Test
    fun test4() {
        val day15 = Day15(parseFile("y2018/day15TestInput4.txt"))
        assertEquals(28944, day15.solvePart1())
    }

    @Test
    fun test5() {
        val day15 = Day15(parseFile("y2018/day15TestInput5.txt"))
        assertEquals(18740, day15.solvePart1())
    }

    @Test
    fun testActual() {
        val day15 = Day15(parseFile("y2018/day15ActualInput.txt"))
        assertEquals(319410, day15.solvePart1())
    }

    @Test
    fun test1Part2() {
        val day15 = Day15(parseFile("y2018/day15TestInput6.txt"))
        assertEquals(4988, day15.solvePart2())
    }

    @Test
    fun test2Part2() {
        val day15 = Day15(parseFile("y2018/day15TestInput7.txt"))
        assertEquals(31284, day15.solvePart2())
    }

    @Test
    fun test3Part2() {
        val day15 = Day15(parseFile("y2018/day15TestInput8.txt"))
        assertEquals(3478, day15.solvePart2())
    }

    @Test
    fun test4Part2() {
        val day15 = Day15(parseFile("y2018/day15TestInput9.txt"))
        assertEquals(6474, day15.solvePart2())
    }

    @Test
    fun test5Part2() {
        val day15 = Day15(parseFile("y2018/day15TestInput10.txt"))
        assertEquals(1140, day15.solvePart2())
    }

    @Test
    fun testActualSecond() {
        val day15 = Day15(parseFile("y2018/day15ActualInput.txt"))
        assertEquals(63168, day15.solvePart2())
    }
}
